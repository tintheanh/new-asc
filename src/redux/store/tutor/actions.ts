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
				
				// Subject ids => actual subjects array
				const subjects: { label: string; full: string }[] = [];
				const subjectIds = objFs!.subjects;
				const subjectSnapshot = await fsdb.collection('subjects').get();
				subjectSnapshot.forEach((doc) => {
					if (subjectIds.includes(doc.id)) {
						const subject = {
							label: doc.data().label,
							full: doc.data().full
						};
						subjects.push(subject);
					}
				});
				
				const tutor = {
					uid: doc.id,
					staff_id: objFs!.staff_id,
					active: objFs!.active,
					is_admin: objFs!.is_admin,
					name: objFs!.name,
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

export const loginAndFetchTutor = (uid: string) => (dispatch: (arg: ActionPayload) => Promise<void>) => {
	return new Promise((resolve, reject) => {
		auth
			.signInWithEmailAndPassword(`${uid}@asc.com`, 'asc1234')
			.then(async () => {
				try {
					const tutor = await fetchTutor(auth.currentUser!.uid);
					dispatch({
						type: TutorActionTypes.FETCH_SUCCESS,
						payload: {
							data: tutor,
							error: ''
						}
					});
					resolve();
				} catch (err) {
					dispatch({
						type: TutorActionTypes.FETCH_ERROR,
						payload: {
							data: {} as Tutor,
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
						data: {} as Tutor,
						error: err.message
					}
				});
				reject(err);
			});
	});
};

export const tutorClockIn = (uid: string) => (dispatch: (arg: ActionPayload) => void) => {
	const update = {
		current_log: getEpochOfTime(new Date())
	};

	fbdb
		.ref(`tutors/${uid}`)
		.update(update)
		.then(async () => {
			try {
				const tutor = await fetchTutor(uid);
				dispatch({
					type: TutorActionTypes.CLOCKIN_SUCCESS,
					payload: {
						data: tutor,
						error: ''
					}
				});
			} catch (err) {
				dispatch({
					type: TutorActionTypes.CLOCKIN_FAILURE,
					payload: {
						data: {} as Tutor,
						error: err.message
					}
				});
			}
		})
		.catch((err) => {
			dispatch({
				type: TutorActionTypes.CLOCKIN_FAILURE,
				payload: {
					data: {} as Tutor,
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
							data: tutor,
							error: ''
						}
					});
				})
				.catch((err) => {
					dispatch({
						type: TutorActionTypes.CLOCKOUT_FAILURE,
						payload: {
							data: {} as Tutor,
							error: err.message
						}
					});
				});
		})
		.catch((err) => {
			dispatch({
				type: TutorActionTypes.CLOCKOUT_FAILURE,
				payload: {
					data: {} as Tutor,
					error: err.message
				}
			});
		});
};

export const logoutAndClearTutor = () => (dispatch: (arg: ActionPayload) => void) => {
	auth
		.signOut()
		.then(() => {
			dispatch({
				type: TutorActionTypes.CLEAR_SUCCESS,
				payload: {
					data: {} as Tutor,
					error: ''
				}
			});
		})
		.catch((err) => {
			dispatch({
				type: TutorActionTypes.CLEAR_SUCCESS,
				payload: {
					data: {} as Tutor,
					error: err.message
				}
			});
		});
};
