import { fbdb, fsdb, auth } from 'index';
import { TutorActionTypes, Tutor, ActionPayload } from './types';
import { getEpochOfDate, getEpochOfTime } from 'utils/functions';

const fetchTutor = (uid: string): Promise<Tutor> => {
	return new Promise(async (resolve, reject) => {
		try {
			const snapshot = await fbdb.ref(`tutors/${uid}`).once('value');
			const doc = await fsdb.collection('tutors').doc(uid).get();
			if (snapshot.val() && doc.exists) {
				const objFb = snapshot.val();
				const objFs = doc.data();

				// Subject ids => subjects array
				const subjects: { label: string; full: string; id: string }[] = [];
				const subjectIds = objFs!.subjects;
				const subjectSnapshot = await fsdb.collection('subjects').get();
				
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

				const tutor = {
					uid: doc.id,
					staff_id: objFs!.staff_id,
					active: objFs!.active,
					is_admin: objFs!.is_admin,
					first_name: objFs!.first_name,
					last_name: objFs!.last_name,
					email: objFs!.email,
					subjects,
					off_time: objFs!.off_time,
					work_schedule: objFs!.work_schedule,
					appointments: objFb.appointments,
					current_log: objFb.current_log,
					work_track: objFb.work_track
				};
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
		const snapshot = await fsdb.collection('tutors').get();
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
					tutor: null,
					tutors
				},
				error: ''
			}
		});
	} catch (err) {
		dispatch({
			type: TutorActionTypes.FETCH_ALL_FAILURE,
			payload: {
				data: {
					tutor: null,
					tutors: null
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
								tutor,
								tutors: null
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
								tutor: null,
								tutors: null
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
							tutor: null,
							tutors: null
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
						tutor: updatedTutor,
						tutors: null
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
						tutor: null,
						tutors: null
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
									tutor,
									tutors: null
								},
								error: ''
							}
						});
					})
					.catch((err) => {
						dispatch({
							type: TutorActionTypes.CLOCKOUT_FAILURE,
							payload: {
								data: {
									tutor: null,
									tutors: null
								},
								error: err.message
							}
						});
					});
			})
			.catch((err) => {
				dispatch({
					type: TutorActionTypes.CLOCKOUT_FAILURE,
					payload: {
						data: {
							tutor: null,
							tutors: null
						},
						error: err.message
					}
				});
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
							tutor,
							tutors: null
						},
						error: 'Invalid. Your time interval is greater than 8 hours. Will not be counted in the system.'
					}
				});
			})
			.catch((err) => {
				dispatch({
					type: TutorActionTypes.CLOCKOUT_FAILURE,
					payload: {
						data: {
							tutor: null,
							tutors: null
						},
						error: err.message
					}
				});
			});
	}
};

export const logoutAndClearTutor = () => (dispatch: (arg: ActionPayload) => void) => {
	auth
		.signOut()
		.then(() => {
			dispatch({
				type: TutorActionTypes.CLEAR_SUCCESS,
				payload: {
					data: {
						tutor: null,
						tutors: null
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
						tutor: null,
						tutors: null
					},
					error: err.message
				}
			});
		});
};

export const updateTutor = (tutor: Tutor) => (dispatch: (arg: ActionPayload) => void): Promise<void> => {
	const subjects: string[] = tutor.subjects.map((e) => e.id);
	const update = {
		active: tutor.active,
		email: tutor.email,
		first_name: tutor.first_name,
		is_admin: tutor.is_admin,
		last_name: tutor.last_name,
		off_time: tutor.off_time,
		staff_id: tutor.staff_id,
		subjects,
		work_schedule: tutor.work_schedule
	};
	return new Promise((resolve, reject) => {
		fsdb
			.collection('tutors')
			.doc(tutor.uid)
			.update(update)
			.then(() => {
				dispatch({
					type: TutorActionTypes.UPDATE_SUCCESS,
					payload: {
						data: {
							tutor: null,
							tutors: null
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
							tutor: null,
							tutors: null
						},
						error: err.message
					}
				});
				reject(err);
			});
	});
};

export const clearError = () => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: TutorActionTypes.CLEAR_ERROR,
		payload: {
			data: {
				tutor: null,
				tutors: null
			},
			error: ''
		}
	});
};
