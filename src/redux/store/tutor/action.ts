import { fbdb, fsdb, auth, functions } from 'index';
import { TutorActionTypes, Tutor, ActionPayload, empty } from './types';
import { getEpochOfDate, getEpochOfTime, preprocessWorkScheduleBeforeUpdate } from 'utils/functions';
import { arraySort } from 'utils/functions';

const fetchTutor = (uid: string): Promise<Tutor> => {
	return new Promise(async (resolve, reject) => {
		try {
			const [ snapshot, doc ] = await Promise.all([
				fbdb.ref(`tutors/${uid}`).once('value'),
				fsdb.collection('tutors').doc(uid).get()
			]);
			if (snapshot.val() && doc.exists) {
				const objFb = snapshot.val();
				const objFs = doc.data();

				// Subject ids => subjects array
				const subjects: { label: string; full: string; id: string }[] = [];
				const subjectIds = objFs!.subjects;
				const subjectSnapshot = await fsdb.collection('subjects').orderBy('label').get();

				subjectSnapshot.forEach((doc) => {
					if (subjectIds.includes(doc.id)) {
						const subject = {
							label: doc.data().label,
							full: doc.data().full,
							id: doc.id
						};
						subjects.push(subject);
					}
				});

				// let off_time: any[];
				// if (snapshot.val().off_time) {
				// 	off_time = Object.keys(snapshot.val().off_time).map(
				// 		(key: string) => snapshot.val().off_time[key]
				// 	);
				// } else {
				// 	off_time = [];
				// }

				// console.log(off_time);

				// Convert array of obj to array of arrays
				// const work_schedule = objFs!.work_schedule.map(
				// 	(schedule: { from: { time: string; order: number }; to: { time: string; order: number } }) => {
				// 		if (schedule !== null) return Object.values(schedule);
				// 		return [];
				// 	}
				// );

				const off_time = objFs!.off_time.map((time: any) => ({ from: time.from.seconds, to: time.to.seconds }));

				let work_schedule: any[];
				if (objFb.work_schedule) {
					work_schedule = objFb.work_schedule.map((work: any) => {
						if (work !== 'none') return work;
						return [];
					});
				} else {
					work_schedule = [[], [], [], [], [], [], []]
				}

				

				const tutor = {
					uid: doc.id,
					staff_id: objFs!.staff_id,
					active: objFs!.active,
					is_admin: objFs!.is_admin,
					first_name: objFs!.first_name,
					last_name: objFs!.last_name,
					email: objFs!.email,
					subjects,
					off_time,
					work_schedule,
					current_log: objFb.current_log,
					work_track: objFb.work_track ? objFb.work_track : null
				} as Tutor;
				resolve(tutor);
			} else {
				reject(new Error('Could not find data.'));
			}
		} catch (err) {
			reject(err);
		}
	});
};

export const fetchAllTutors = () => async (dispatch: (arg: ActionPayload) => void) => {
	try {
		const snapshot = await fsdb.collection('tutors').orderBy('first_name').get();
		const tutors: Tutor[] = await Promise.all(
			snapshot.docs.map((doc) => {
			
				if (doc.exists) {
					const tutorId = doc.id;
					return fetchTutor(tutorId);
				}
				return new Promise((resolve) => resolve());
			})
		);
		dispatch({
			type: TutorActionTypes.FETCH_ALL_SUCCESS,
			payload: {
				data: {
					doneTime: null,
					tutor: null,
					tutors,
					selectedTutor: null,
					toggleAdd: false
				},
				error: ''
			}
		});
	} catch (err) {
		dispatch({
			type: TutorActionTypes.FETCH_ALL_FAILURE,
			payload: {
				data: {
					doneTime: null,
					tutor: null,
					tutors: [],
					selectedTutor: null,
					toggleAdd: false
				},
				error: err.message
			}
		});
	}
};

export const loginAndFetchTutor = (uid: string) => (dispatch: (arg: ActionPayload) => void): Promise<void> => {
	return new Promise((resolve, reject) => {
		auth
			.signInWithEmailAndPassword(`${uid}@asc.com`, 'asc1234')
			.then(async () => {
				try {
					const tutor = await fetchTutor(auth.currentUser!.uid);
					dispatch({
						type: TutorActionTypes.FETCH_SUCCESS,
						payload: {
							data: {
								doneTime: null,
								tutor,
								tutors: [],
								selectedTutor: null,
								toggleAdd: false
							},
							error: ''
						}
					});
					resolve();
				} catch (err) {
					dispatch({
						type: TutorActionTypes.FETCH_ERROR,
						payload: {
							data: {
								doneTime: null,
								tutor: null,
								tutors: [],
								selectedTutor: null,
								toggleAdd: false
							},
							error: err.message
						}
					});
					reject(err);
				}
			})
			.catch((err) => {
				dispatch({
					type: TutorActionTypes.FETCH_ERROR,
					payload: {
						data: {
							doneTime: null,
							tutor: null,
							tutors: [],
							selectedTutor: null,
							toggleAdd: false
						},
						error: err.message
					}
				});
				reject(err);
			});
	});
};

export const tutorClockIn = (tutor: Tutor) => (dispatch: (arg: ActionPayload) => void) => {
	const update = {
		current_log: getEpochOfTime(new Date())
	};

	fbdb
		.ref(`tutors/${tutor.uid}`)
		.update(update)
		.then(() => {
			const updatedTutor = { ...tutor };
			updatedTutor.current_log = update.current_log;
			dispatch({
				type: TutorActionTypes.CLOCKIN_SUCCESS,
				payload: {
					data: {
						doneTime: null,
						tutor: updatedTutor,
						tutors: [],
						selectedTutor: null,
						toggleAdd: false
					},
					error: ''
				}
			});
		})
		.catch((err) => {
			dispatch({
				type: TutorActionTypes.CLOCKIN_FAILURE,
				payload: {
					data: {
						doneTime: null,
						tutor: null,
						tutors: [],
						selectedTutor: null,
						toggleAdd: false
					},
					error: err.message
				}
			});
		});
};

export const tutorClockOut = (uid: string, inTime: number) => (dispatch: (arg: ActionPayload) => void) => {
	const doneTime = {
		in: inTime,
		out: getEpochOfTime(new Date())
	};

	// Only valid if work time < 8 hours
	// console.log(Math.floor((doneTime.out - doneTime.in) / 60 / 60));
	return new Promise((resolve, reject) => {
		if (Math.floor((doneTime.out - doneTime.in) / 60 / 60) < 8) {
			fbdb
				.ref(`tutors/${uid}/work_track`)
				.child(String(getEpochOfDate(new Date())))
				.push(doneTime)
				.then(() => {
					const update = {
						current_log: 0
					};

					fbdb
						.ref(`tutors/${uid}`)
						.update(update)
						.then(async () => {
							const tutor = await fetchTutor(uid);
							dispatch({
								type: TutorActionTypes.CLOCKOUT_SUCCESS,
								payload: {
									data: {
										doneTime,
										tutor,
										tutors: [],
										selectedTutor: null,
										toggleAdd: false
									},
									error: ''
								}
							});
							resolve();
						})
						.catch((err) => {
							dispatch({
								type: TutorActionTypes.CLOCKOUT_FAILURE,
								payload: {
									data: {
										doneTime: null,
										tutor: null,
										tutors: [],
										selectedTutor: null,
										toggleAdd: false
									},
									error: err.message
								}
							});
							reject(err);
						});
				})
				.catch((err) => {
					dispatch({
						type: TutorActionTypes.CLOCKOUT_FAILURE,
						payload: {
							data: {
								doneTime: null,
								tutor: null,
								tutors: [],
								selectedTutor: null,
								toggleAdd: false
							},
							error: err.message
						}
					});
					reject(err);
				});
		} else {
			// reset current_log if work time exceeds 8 hours
			const update = {
				current_log: 0
			};

			fbdb
				.ref(`tutors/${uid}`)
				.update(update)
				.then(async () => {
					const tutor = await fetchTutor(uid);
					dispatch({
						type: TutorActionTypes.CLOCKOUT_SUCCESS,
						payload: {
							data: {
								doneTime: null,
								tutor,
								tutors: [],
								selectedTutor: null,
								toggleAdd: false
							},
							error:
								'Invalid. Your time interval is greater than 8 hours. Will not be counted in the system.'
						}
					});
					resolve();
				})
				.catch((err) => {
					dispatch({
						type: TutorActionTypes.CLOCKOUT_FAILURE,
						payload: {
							data: {
								doneTime: null,
								tutor: null,
								tutors: [],
								selectedTutor: null,
								toggleAdd: false
							},
							error: err.message
						}
					});
					reject(err);
				});
		}
	});
};

export const logoutAndClearTutor = () => (dispatch: (arg: ActionPayload) => void) => {
	auth
		.signOut()
		.then(() => {
			dispatch({
				type: TutorActionTypes.CLEAR_SUCCESS,
				payload: {
					data: {
						doneTime: null,
						tutor: null,
						tutors: [],
						selectedTutor: null,
						toggleAdd: false
					},
					error: ''
				}
			});
		})
		.catch((err) => {
			dispatch({
				type: TutorActionTypes.CLEAR_FAILURE,
				payload: {
					data: {
						doneTime: null,
						tutor: null,
						tutors: [],
						selectedTutor: null,
						toggleAdd: false
					},
					error: err.message
				}
			});
		});
};

export const addTutor = (tutor: Tutor, tutors: Tutor[]) => (dispatch: (arg: ActionPayload) => void): Promise<void> => {
	const updateWorkSchedule = preprocessWorkScheduleBeforeUpdate(tutor.work_schedule);
	const subjects = tutor.subjects.map((e) => e.id);
	const latest = { ...tutor, subjects, work_schedule: updateWorkSchedule };

	const { current_log, work_track, uid, ...forFs } = latest;
	const forFb = {
		current_log
	};

	return new Promise(async (resolve, reject) => {
		try {
			const userData = await auth.createUserWithEmailAndPassword(`${tutor.staff_id}@asc.com`, 'asc1234');
			if (userData && userData.user) {
				const { uid } = userData.user;
				const clone = { ...tutor };
				clone.uid = uid;
				tutors.push(clone);
				const sorted = arraySort(tutors, 'first_name');
				fsdb
					.collection('tutors')
					.doc(uid)
					.set(forFs)
					.then(() => {
						fbdb
							.ref(`tutors/${uid}`)
							.set(forFb)
							.then(() => {
								dispatch({
									type: TutorActionTypes.ADD_SUCCESS,
									payload: {
										data: {
											doneTime: null,
											tutor: null,
											tutors: sorted,
											selectedTutor: null,
											toggleAdd: false
										},
										error: ''
									}
								});
								resolve();
							})
							.catch((err) => {
								dispatch({
									type: TutorActionTypes.ADD_FAILURE,
									payload: {
										data: {
											doneTime: null,
											tutor: null,
											tutors: [],
											selectedTutor: null,
											toggleAdd: false
										},
										error: err.message
									}
								});
								reject(err);
							});
					})
					.catch((err) => {
						dispatch({
							type: TutorActionTypes.ADD_FAILURE,
							payload: {
								data: {
									doneTime: null,
									tutor: null,
									tutors: [],
									selectedTutor: null,
									toggleAdd: false
								},
								error: err.message
							}
						});
						reject(err);
					});
			}
		} catch (err) {
			dispatch({
				type: TutorActionTypes.ADD_FAILURE,
				payload: {
					data: {
						doneTime: null,
						tutor: null,
						tutors: [],
						selectedTutor: null,
						toggleAdd: false
					},
					error: err.message
				}
			});
			reject(err);
		}
	});
};

export const updateTutor = (tutor: Tutor, tutors: Tutor[], scheduleOnly: boolean = false) => (
	dispatch: (arg: ActionPayload) => void
): Promise<void> => {
	const { current_log, work_track, uid, work_schedule, ...updateForFs } = tutor;

	const processWorkSchedule = work_schedule.map((schedule) => {
		if (schedule.length) return schedule;
		return 'none';
	});

	

	const index = tutors.findIndex((tt) => tt.uid === tutor.uid);
	const all = [ ...tutors ];
	all[index] = { ...tutor, subjects: arraySort(tutor.subjects, 'label'), work_schedule: tutor.work_schedule };

	return new Promise((resolve, reject) => {
		if (scheduleOnly) {
			fbdb
				.ref(`tutors/${tutor.uid}/work_schedule`)
				.set(processWorkSchedule)
				.then(() => {
					dispatch({
						type: TutorActionTypes.UPDATE_SUCCESS,
						payload: {
							data: {
								doneTime: null,
								tutor: null,
								tutors: all,
								selectedTutor: null,
								toggleAdd: false
							},
							error: ''
						}
					});
					resolve();
				})
				.catch((err) => {
					dispatch({
						type: TutorActionTypes.UPDATE_FAILURE,
						payload: {
							data: {
								doneTime: null,
								tutor: null,
								tutors: [],
								selectedTutor: null,
								toggleAdd: false
							},
							error: err.message
						}
					});
					reject(err);
				});
		} else {
			if (tutor.staff_id !== tutors.filter((tt) => tt.uid === tutor.uid)[0].staff_id) {
				const updateUserEmail = functions.httpsCallable('updateUserEmail');

				updateUserEmail({ uid:tutor.uid, newEmail: tutor.staff_id }).then(() => console.log('update email successfully.')).catch(err => console.warn(err.message));
			}
			const subjects = tutor.subjects.map((e) => e.id);
			const newOffTimes = updateForFs.off_time.map((time: any) => ({
				from: new Date(time.from * 1000),
				to: new Date(time.to * 1000)
			})) as any;
			updateForFs.off_time = newOffTimes;
			fsdb
				.collection('tutors')
				.doc(tutor.uid)
				.update({ ...updateForFs, subjects })
				.then(() => {
					dispatch({
						type: TutorActionTypes.UPDATE_SUCCESS,
						payload: {
							data: {
								doneTime: null,
								tutor: null,
								tutors: all,
								selectedTutor: null,
								toggleAdd: false
							},
							error: ''
						}
					});
					resolve();
				})
				.catch((err) => {
					dispatch({
						type: TutorActionTypes.UPDATE_FAILURE,
						payload: {
							data: {
								doneTime: null,
								tutor: null,
								tutors: [],
								selectedTutor: null,
								toggleAdd: false
							},
							error: err.message
						}
					});
					reject(err);
				});
		}
	});
};

export const clear = () => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: TutorActionTypes.CLEAR,
		payload: {
			data: {
				doneTime: null,
				tutor: null,
				tutors: [],
				selectedTutor: null,
				toggleAdd: false
			},
			error: ''
		}
	});
};

export const selectAndUpdateTutor = (tutor: Tutor) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: TutorActionTypes.SELECT_AND_UPDATE_TUTOR,
		payload: {
			data: {
				doneTime: null,
				tutor: null,
				tutors: [],
				selectedTutor: tutor,
				toggleAdd: false
			},
			error: ''
		}
	});
};

export const toggleAddTutor = (on: boolean) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: TutorActionTypes.TOGGLE_ADD,
		payload: {
			data: {
				doneTime: null,
				tutor: null,
				tutors: [],
				selectedTutor: empty,
				toggleAdd: on
			},
			error: ''
		}
	});
};

export const resetTutor = (uid: string, data: Tutor[]) => (dispatch: (arg: ActionPayload) => void) => {
	const oldTutor = data.filter((tutor) => tutor.uid === uid)[0];
	dispatch({
		type: TutorActionTypes.SELECT_AND_UPDATE_TUTOR,
		payload: {
			data: {
				doneTime: null,
				tutor: null,
				tutors: [],
				selectedTutor: oldTutor,
				toggleAdd: false
			},
			error: ''
		}
	});
};

export const deleteTutor = (uid: string, data: Tutor[]) => (dispatch: (arg: ActionPayload) => void) => {
	const deleteFunc = functions.httpsCallable('deleteUser');
	deleteFunc({ uid })
		.then(() => {
			fbdb
				.ref(`tutors/${uid}`)
				.remove()
				.then(() => {
					fsdb
						.collection('tutors')
						.doc(uid)
						.delete()
						.then(() => {
							const newTutors = data.filter((tutor) => tutor.uid !== uid);
							dispatch({
								type: TutorActionTypes.DELETE_SUCCESS,
								payload: {
									data: {
										doneTime: null,
										tutor: null,
										tutors: newTutors,
										selectedTutor: null,
										toggleAdd: false
									},
									error: ''
								}
							});
						})
						.catch((err) =>
							dispatch({
								type: TutorActionTypes.DELETE_FAILURE,
								payload: {
									data: {
										doneTime: null,
										tutor: null,
										tutors: [],
										selectedTutor: null,
										toggleAdd: false
									},
									error: err.message
								}
							})
						);
				})
				.catch((err) =>
					dispatch({
						type: TutorActionTypes.DELETE_FAILURE,
						payload: {
							data: {
								doneTime: null,
								tutor: null,
								tutors: [],
								selectedTutor: null,
								toggleAdd: false
							},
							error: err.message
						}
					})
				);
		})
		.catch((err) =>
			dispatch({
				type: TutorActionTypes.DELETE_FAILURE,
				payload: {
					data: {
						doneTime: null,
						tutor: null,
						tutors: [],
						selectedTutor: null,
						toggleAdd: false
					},
					error: err.message
				}
			})
		);
};
