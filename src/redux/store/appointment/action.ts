import { fbdb, fsdb } from 'index';
import { AppointmentActionTypes, ActionPayload } from './types';
import { getEpochOfTime } from 'utils/functions';
const allSettled = require('promise.allsettled');

const getShift = (workDay: any[], appt_id: string) => {
	for (let i = 0; i < workDay.length; i++) {
		if (workDay[i].appointments) {
			if (workDay[i].appointments[appt_id]) {
				return i;
			}
		}
	}
	return -1;
};

const processAppointments = async (snapshotActive: any) => {
	const appointments = await Promise.all(
		Object.keys(snapshotActive.val()).map(async (key: string) => {
			const obj = snapshotActive.val()[key];
			const [ studentSnapshot, tutorSnapshot, subjectSnapshot ] = await Promise.all([
				fsdb.collection('students').doc(obj.student_id).get(),
				fsdb.collection('tutors').doc(obj.tutor_id).get(),
				fsdb.collection('subjects').doc(obj.subject_id).get()
			]);

			const appointment = {
				id: key,
				apptDate: obj.apptDate,
				status: obj.status,
				student: {
					uid: obj.student_id,
					first_name: studentSnapshot.data()!.first_name,
					studentId: studentSnapshot.data()!.studentId,
					last_name: studentSnapshot.data()!.last_name,
					email: studentSnapshot.data()!.email
				},
				subject: {
					id: obj.subject_id,
					label: subjectSnapshot.data()!.label,
					full: subjectSnapshot.data()!.full
				},
				time: obj.time,
				tutor: {
					uid: obj.tutor_id,
					first_name: tutorSnapshot.data()!.first_name,
					last_name: tutorSnapshot.data()!.last_name,
					email: tutorSnapshot.data()!.email
				}
			};
			return appointment;
		})
	);
	return appointments;
};

export const fetchTodayAppointments = () => async (dispatch: (arg: ActionPayload) => void) => {
	try {
		const todayAppointments: any[] = [];
		const beginOfday = Math.floor(new Date().setHours(0, 0, 0) / 1000);
		const endOfDay = Math.floor(new Date().setHours(23, 59, 59) / 1000);
		const snapshot = await fbdb.ref('appointments').once('value');
		snapshot.forEach((doc) => {
			const appt = doc.val();
			if (appt.apptDate >= beginOfday && appt.apptDate <= endOfDay)
				todayAppointments.push({ ...appt, id: doc.key });
		});
		dispatch({
			type: AppointmentActionTypes.FETCH_TODAY_SUCCESS,
			payload: {
				data: {
					todayAppointments,
					studentPrompt: '',
					appointments: [],
					filteredAppointments: [],
					selectedAppointment: null,
					toggleFilter: false,
					filter: {
						dateFilter: [],
						tutors: [],
						tutor: null,
						student: null,
						subject: null,
						days: null,
						type: ''
					}
				},
				error: ''
			}
		});
	} catch (err) {
		dispatch({
			type: AppointmentActionTypes.FETCH_TODAY_FAILTURE,
			payload: {
				data: {
					todayAppointments: [],
					studentPrompt: '',
					appointments: [],
					filteredAppointments: [],
					selectedAppointment: null,
					toggleFilter: false,
					filter: {
						dateFilter: [],
						tutors: [],
						tutor: null,
						student: null,
						subject: null,
						days: null,
						type: ''
					}
				},
				error: err.message
			}
		});
	}
};

export const checkAppointment = (student_id: string, appointments: any[]) => (
	dispatch: (arg: ActionPayload) => void
) => {
	const now = getEpochOfTime(new Date());
	const studentAppt = appointments.filter((appt: any) => {
		if (appt.student_id === student_id) {
			if (Math.abs(now - appt.apptDate) <= 600) {
				return appt;
			}
		}
	})[0];

	fbdb
		.ref(`appointments/${studentAppt.id}`)
		.remove()
		.then(() => {
			const checkedAppt = {
				apptDate: studentAppt.apptDate,
				dateCreated: studentAppt.dateCreated,
				status: 'checked',
				student_id: studentAppt.student_id,
				subject_id: studentAppt.subject_id,
				time: studentAppt.time,
				tutor_id: studentAppt.tutor_id
			};
			console.log(checkedAppt);
			fbdb
				.ref('past-appointments')
				.child(studentAppt.id)
				.set(checkedAppt)
				.then(async () => {
					const day = new Date(studentAppt.apptDate * 1000).getDay();
					const workDayRef = await fbdb
						.ref(`tutors/${studentAppt.tutor_id}/work_schedule/${day}`)
						.once('value');
					const workDay = workDayRef.val();
					const index = getShift(workDay, studentAppt.id);
					if (index > -1) {
						fbdb
							.ref(
								`tutors/${studentAppt.tutor_id}/work_schedule/${day}/${index}/appointments/${studentAppt.id}`
							)
							.remove()
							.then(() =>
								dispatch({
									type: AppointmentActionTypes.STUDENT_CHECK_APPOINTMENT_SUCCESS,
									payload: {
										data: {
											todayAppointments: [],
											studentPrompt: 'Done',
											appointments: [],
											filteredAppointments: [],
											selectedAppointment: null,
											toggleFilter: false,
											filter: {
												dateFilter: [],
												tutors: [],
												tutor: null,
												student: null,
												subject: null,
												days: null,
												type: ''
											}
										},
										error: ''
									}
								})
							)
							.catch((err) =>
								dispatch({
									type: AppointmentActionTypes.STUDENT_CHECK_APPOINTMENT_FAILURE,
									payload: {
										data: {
											todayAppointments: [],
											studentPrompt: 'shit',
											appointments: [],
											filteredAppointments: [],
											selectedAppointment: null,
											toggleFilter: false,
											filter: {
												dateFilter: [],
												tutors: [],
												tutor: null,
												student: null,
												subject: null,
												days: null,
												type: ''
											}
										},
										error: err.message
									}
								})
							);
					} else {
						dispatch({
							type: AppointmentActionTypes.STUDENT_CHECK_APPOINTMENT_FAILURE,
							payload: {
								data: {
									todayAppointments: [],
									studentPrompt: 'shit',
									appointments: [],
									filteredAppointments: [],
									selectedAppointment: null,
									toggleFilter: false,
									filter: {
										dateFilter: [],
										tutors: [],
										tutor: null,
										student: null,
										subject: null,
										days: null,
										type: ''
									}
								},
								error: 'Error occurred.'
							}
						});
					}
				})
				.catch((err) =>
					dispatch({
						type: AppointmentActionTypes.STUDENT_CHECK_APPOINTMENT_FAILURE,
						payload: {
							data: {
								todayAppointments: [],
								studentPrompt: 'shit',
								appointments: [],
								filteredAppointments: [],
								selectedAppointment: null,
								toggleFilter: false,
								filter: {
									dateFilter: [],
									tutors: [],
									tutor: null,
									student: null,
									subject: null,
									days: null,
									type: ''
								}
							},
							error: err.message
						}
					})
				);
		})
		.catch((err) =>
			dispatch({
				type: AppointmentActionTypes.STUDENT_CHECK_APPOINTMENT_FAILURE,
				payload: {
					data: {
						todayAppointments: [],
						studentPrompt: 'shit',
						appointments: [],
						filteredAppointments: [],
						selectedAppointment: null,
						toggleFilter: false,
						filter: {
							dateFilter: [],
							tutors: [],
							tutor: null,
							student: null,
							subject: null,
							days: null,
							type: ''
						}
					},
					error: err.message
				}
			})
		);
};

export const fetchAllAppointments = () => async (dispatch: (arg: ActionPayload) => void) => {
	try {
		const [ snapshotActive, snapshotPast ] = await allSettled([
			fbdb.ref('appointments').once('value'),
			fbdb.ref('past-appointments').once('value')
		]);

		const [ activeAppointments, pastAppointment ] = await allSettled([
			processAppointments(snapshotActive.value),
			processAppointments(snapshotPast.value)
		]);

		let appointments;
		if (activeAppointments.status === 'fulfilled' && pastAppointment.status === 'fulfilled')
			appointments = [ ...activeAppointments.value, ...pastAppointment.value ];
		else if (activeAppointments.status === 'fulfilled' && pastAppointment.status === 'rejected')
			appointments = [ ...activeAppointments.value ];
		else if (activeAppointments.status === 'rejected' && pastAppointment.status === 'fulfilled')
			appointments = [ ...pastAppointment.value ];
		else appointments = [];

		dispatch({
			type: AppointmentActionTypes.FETCH_ALL_SUCCESS,
			payload: {
				data: {
					todayAppointments: [],
					studentPrompt: '',
					appointments,
					filteredAppointments: [],
					selectedAppointment: null,
					toggleFilter: false,
					filter: {
						dateFilter: [],
						tutors: [],
						tutor: null,
						student: null,
						subject: null,
						days: null,
						type: ''
					}
				},
				error: ''
			}
		});
	} catch (err) {
		dispatch({
			type: AppointmentActionTypes.FETCH_ALL_FAILURE,
			payload: {
				data: {
					todayAppointments: [],
					studentPrompt: '',
					appointments: [],
					filteredAppointments: [],
					selectedAppointment: null,
					toggleFilter: false,
					filter: {
						dateFilter: [],
						tutors: [],
						tutor: null,
						student: null,
						subject: null,
						days: null,
						type: ''
					}
				},
				error: err.message
			}
		});
	}
};

export const selectAppointment = (selectedAppointment: any) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.SELECT_APPOINTMENT,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment,
				toggleFilter: false,
				filter: {
					dateFilter: [ null, null ],
					tutors: [],
					tutor: null,
					student: null,
					subject: null,
					days: null,
					type: ''
				}
			},
			error: ''
		}
	});
};

export const removeAppointment = (appointments: any[], selectedAppointment: any) => (
	dispatch: (arg: ActionPayload) => void
) => {
	const thingToDelete = {
		tutor_id: selectedAppointment.tutor.uid,
		student_id: selectedAppointment.student.uid,
		day: new Date(selectedAppointment.apptDate * 1000).getDay(),
		appt_id: selectedAppointment.id,
		status: selectedAppointment.status
	};
	const forEmail = {
		tutorName: `${selectedAppointment.tutor.first_name} ${selectedAppointment.tutor.last_name}`,
		tutorEmail: selectedAppointment.tutor.email,
		studentName: `${selectedAppointment.student.first_name} ${selectedAppointment.student.last_name}`,
		studentEmail: selectedAppointment.student.email,
		subject: `${selectedAppointment.subject.label} ${selectedAppointment.subject.full}`,
		date: new Date(selectedAppointment.apptDate * 1000).toDateString(),
		timeFrom: selectedAppointment.time.from,
		timeTo: selectedAppointment.time.to,
		reason: ''
	};
	const { student_id, tutor_id, appt_id, day, status } = thingToDelete;
	const dbPath = status === 'pending' ? 'appointments' : 'past-appointments';
	fbdb
		.ref(`${dbPath}/${appt_id}`)
		.remove()
		.then(async () => {
			const workDayRef = await fbdb.ref(`tutors/${tutor_id}/work_schedule/${day}`).once('value');
			const workDay = workDayRef.val();
			const index = getShift(workDay, appt_id);
			if (index > -1) {
				fbdb
					.ref(`tutors/${tutor_id}/work_schedule/${day}/${index}/appointments/${appt_id}`)
					.remove()
					.then(() => {
						if (status === 'pending') {
							fetch(
								'https://us-central1-asc-management-app.cloudfunctions.net/sendMailForDeletingAppointment',
								{
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify(forEmail)
								}
							)
								.then((_) => {
									const newAppointments = appointments.filter((appt: any) => appt.id !== appt_id);
									dispatch({
										type: AppointmentActionTypes.REMOVE_APPOINTMENT_SUCCESS,
										payload: {
											data: {
												todayAppointments: [],
												studentPrompt: '',
												appointments: newAppointments,
												filteredAppointments: [],
												selectedAppointment: null,
												toggleFilter: false,
												filter: {
													dateFilter: [ null, null ],
													tutors: [],
													tutor: null,
													student: null,
													subject: null,
													days: null,
													type: ''
												}
											},
											error: ''
										}
									});
								})
								.catch((err) =>
									dispatch({
										type: AppointmentActionTypes.REMOVE_APPOINTMENT_FAILURE,
										payload: {
											data: {
												todayAppointments: [],
												studentPrompt: '',
												appointments: [],
												filteredAppointments: [],
												selectedAppointment: null,
												toggleFilter: false,
												filter: {
													dateFilter: [ null, null ],
													tutors: [],
													tutor: null,
													student: null,
													subject: null,
													days: null,
													type: ''
												}
											},
											error: err.message
										}
									})
								);
						} else if (status === 'checked') {
							const newAppointments = appointments.filter((appt: any) => appt.id !== appt_id);
							dispatch({
								type: AppointmentActionTypes.REMOVE_APPOINTMENT_SUCCESS,
								payload: {
									data: {
										todayAppointments: [],
										studentPrompt: '',
										appointments: newAppointments,
										filteredAppointments: [],
										selectedAppointment: null,
										toggleFilter: false,
										filter: {
											dateFilter: [ null, null ],
											tutors: [],
											tutor: null,
											student: null,
											subject: null,
											days: null,
											type: ''
										}
									},
									error: ''
								}
							});
						} else {
							const studentRef = fsdb.collection('students').doc(student_id);

							fsdb
								.runTransaction((t) =>
									t.get(studentRef).then((doc) => {
										const newNoShow = doc.data()!.no_show - 1;
										t.update(studentRef, { no_show: newNoShow });
									})
								)
								.then(() => {
									const newAppointments = appointments.filter((appt: any) => appt.id !== appt_id);
									dispatch({
										type: AppointmentActionTypes.REMOVE_APPOINTMENT_SUCCESS,
										payload: {
											data: {
												todayAppointments: [],
												studentPrompt: '',
												appointments: newAppointments,
												filteredAppointments: [],
												selectedAppointment: null,
												toggleFilter: false,
												filter: {
													dateFilter: [ null, null ],
													tutors: [],
													tutor: null,
													student: null,
													subject: null,
													days: null,
													type: ''
												}
											},
											error: ''
										}
									});
								})
								.catch((err) =>
									dispatch({
										type: AppointmentActionTypes.REMOVE_APPOINTMENT_FAILURE,
										payload: {
											data: {
												todayAppointments: [],
												studentPrompt: '',
												appointments: [],
												filteredAppointments: [],
												selectedAppointment: null,
												toggleFilter: false,
												filter: {
													dateFilter: [ null, null ],
													tutors: [],
													tutor: null,
													student: null,
													subject: null,
													days: null,
													type: ''
												}
											},
											error: err.message
										}
									})
								);
						}
					})
					.catch((err) =>
						dispatch({
							type: AppointmentActionTypes.REMOVE_APPOINTMENT_FAILURE,
							payload: {
								data: {
									todayAppointments: [],
									studentPrompt: '',
									appointments: [],
									filteredAppointments: [],
									selectedAppointment: null,
									toggleFilter: false,
									filter: {
										dateFilter: [ null, null ],
										tutors: [],
										tutor: null,
										student: null,
										subject: null,
										days: null,
										type: ''
									}
								},
								error: err.message
							}
						})
					);
			} else {
				dispatch({
					type: AppointmentActionTypes.REMOVE_APPOINTMENT_FAILURE,
					payload: {
						data: {
							todayAppointments: [],
							studentPrompt: '',
							appointments: [],
							filteredAppointments: [],
							selectedAppointment: null,
							toggleFilter: false,
							filter: {
								dateFilter: [ null, null ],
								tutors: [],
								tutor: null,
								student: null,
								subject: null,
								days: null,
								type: ''
							}
						},
						error: 'Could not find shift index.'
					}
				});
			}
		})
		.catch((err) =>
			dispatch({
				type: AppointmentActionTypes.REMOVE_APPOINTMENT_FAILURE,
				payload: {
					data: {
						todayAppointments: [],
						studentPrompt: '',
						appointments: [],
						filteredAppointments: [],
						selectedAppointment: null,
						toggleFilter: false,
						filter: {
							dateFilter: [ null, null ],
							tutors: [],
							tutor: null,
							student: null,
							subject: null,
							days: null,
							type: ''
						}
					},
					error: err.message
				}
			})
		);
};

export const setDateFromFilter = (date: Date) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.SET_DATE_FROM_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment: null,
				toggleFilter: false,
				filter: {
					dateFilter: [ date ],
					tutors: [],
					tutor: null,
					student: null,
					subject: null,
					days: null,
					type: ''
				}
			},
			error: ''
		}
	});
};

export const setDateToFilter = (date: Date) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.SET_DATE_TO_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment: null,
				toggleFilter: false,
				filter: {
					dateFilter: [ date ],
					tutors: [],
					tutor: null,
					student: null,
					subject: null,
					days: null,
					type: ''
				}
			},
			error: ''
		}
	});
};

export const fetchTutorsForFilter = () => async (dispatch: (arg: ActionPayload) => void) => {
	try {
		const tutorRef = await fsdb.collection('tutors').orderBy('first_name').get();
		const tutors = tutorRef.docs.map((tutor: any) => ({
			label: `${tutor.data().first_name} ${tutor.data().last_name}`,
			value: tutor.id
		}));
		dispatch({
			type: AppointmentActionTypes.FETCH_TUTORS_FILTER_SUCCESS,
			payload: {
				data: {
					todayAppointments: [],
					studentPrompt: '',
					appointments: [],
					filteredAppointments: [],
					selectedAppointment: null,
					toggleFilter: false,
					filter: {
						dateFilter: [],
						tutors,
						tutor: null,
						student: null,
						subject: null,
						days: null,
						type: ''
					}
				},
				error: ''
			}
		});
	} catch (err) {
		dispatch({
			type: AppointmentActionTypes.FETCH_TUTORS_FILTER_SUCCESS,
			payload: {
				data: {
					todayAppointments: [],
					studentPrompt: '',
					appointments: [],
					filteredAppointments: [],
					selectedAppointment: null,
					toggleFilter: false,
					filter: {
						dateFilter: [],
						tutors: [],
						tutor: null,
						student: null,
						subject: null,
						days: null,
						type: ''
					}
				},
				error: err.message
			}
		});
	}
};

export const setStudentFilter = (student: any) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.SET_STUDENT_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment: null,
				toggleFilter: false,
				filter: {
					dateFilter: [],
					tutors: [],
					tutor: null,
					student,
					subject: null,
					days: null,
					type: ''
				}
			},
			error: ''
		}
	});
};

export const setTutorFilter = (tutor: any) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.SET_TUTOR_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment: null,
				toggleFilter: false,
				filter: {
					dateFilter: [],
					tutors: [],
					tutor,
					student: null,
					subject: null,
					days: null,
					type: ''
				}
			},
			error: ''
		}
	});
};

export const setSubjectFilter = (subject: any) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.SET_SUBJECT_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment: null,
				toggleFilter: false,
				filter: {
					dateFilter: [],
					tutors: [],
					tutor: null,
					student: null,
					subject,
					days: null,
					type: ''
				}
			},
			error: ''
		}
	});
};

export const setDayFilter = (day: any) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.SET_DAY_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment: null,
				toggleFilter: false,
				filter: {
					dateFilter: [],
					tutors: [],
					tutor: null,
					student: null,
					subject: null,
					days: new Set([ Number(day) ]),
					type: ''
				}
			},
			error: ''
		}
	});
};

export const removeDayFilter = (day: any) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.REMOVE_DAY_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment: null,
				toggleFilter: false,
				filter: {
					dateFilter: [],
					tutors: [],
					tutor: null,
					student: null,
					subject: null,
					days: new Set([ Number(day) ]),
					type: ''
				}
			},
			error: ''
		}
	});
};

export const setTypeFilter = (type: any) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.SET_TYPE_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment: null,
				toggleFilter: false,
				filter: {
					dateFilter: [],
					tutors: [],
					tutor: null,
					student: null,
					subject: null,
					days: null,
					type: new Set([ type ])
				}
			},
			error: ''
		}
	});
};

export const removeTypeFilter = (type: any) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.REMOVE_TYPE_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment: null,
				toggleFilter: false,
				filter: {
					dateFilter: [],
					tutors: [],
					tutor: null,
					student: null,
					subject: null,
					days: null,
					type: new Set([ type ])
				}
			},
			error: ''
		}
	});
};

export const applyFilter = (appointments: any[], filter: any) => (dispatch: (arg: ActionPayload) => void) => {
	let criteria = 0;
	if (filter.dateFilter[0] && filter.dateFilter[1]) criteria++;
	if (filter.days.size) criteria++;
	if (filter.student) criteria++;
	if (filter.subject) criteria++;
	if (filter.tutor) criteria++;
	if (filter.type.size) criteria++;
	const filterAppts = appointments.filter((appt: any) => {
		let metCriteria = 0;

		if (filter.dateFilter[0] && filter.dateFilter[1]) {
			const resetApptDate = Math.floor(new Date(appt.apptDate * 1000).setHours(0, 0, 0) / 1000);
			if (
				resetApptDate >= Math.floor(filter.dateFilter[0].getTime() / 1000) &&
				resetApptDate <= Math.floor(filter.dateFilter[1].getTime() / 1000)
			)
				metCriteria++;
		}

		if (filter.days.size) {
			const apptDay = new Date(appt.apptDate * 1000).getDay();
			if (filter.days.has(apptDay)) metCriteria++;
		}

		if (filter.student) {
			if (filter.student.value === appt.student.uid) metCriteria++;
		}

		if (filter.tutor) {
			if (filter.tutor.value === appt.tutor.uid) metCriteria++;
		}

		if (filter.subject) {
			if (filter.subject.value === appt.subject.id) metCriteria++;
		}

		if (filter.type.size) {
			if (filter.type.has(appt.status)) metCriteria++;
		}

		if (metCriteria === criteria) return appt;
	});
	dispatch({
		type: AppointmentActionTypes.APPLY_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: filterAppts,
				selectedAppointment: null,
				toggleFilter: true,
				filter: {
					dateFilter: [],
					tutors: [],
					tutor: null,
					student: null,
					subject: null,
					days: null,
					type: null
				}
			},
			error: ''
		}
	});
};

export const clearFilter = () => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: AppointmentActionTypes.CLEAR_FILTER,
		payload: {
			data: {
				todayAppointments: [],
				studentPrompt: '',
				appointments: [],
				filteredAppointments: [],
				selectedAppointment: null,
				toggleFilter: false,
				filter: {
					dateFilter: [ null, null ],
					tutors: [],
					tutor: null,
					student: null,
					subject: null,
					days: new Set(),
					type: new Set()
				}
			},
			error: ''
		}
	});
};
