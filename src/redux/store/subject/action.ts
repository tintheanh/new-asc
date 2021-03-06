import { SubjectActionTypes, Subject, ActionPayload, empty } from './types';
import { fsdb } from 'index';
import { arraySort } from 'utils/functions';

export const fetchAllSubjects = () => async (dispatch: (arg: ActionPayload) => void) => {
	try {
		const snapshot = await fsdb.collection('subjects').orderBy('label').get();
		const subjects: Subject[] = snapshot.docs.map((doc) => {
			if (doc.exists) {
				const subject = doc.data();
				return {
					label: subject.label,
					full: subject.full,
					id: doc.id
				} as Subject;
			}
			return {} as Subject;
		});

		dispatch({
			type: SubjectActionTypes.FETCH_ALL_SUBJECTS_SUCCESS,
			payload: {
				data: {
					selectedSubject: null,
					subjects: subjects,
					toggleAdd: false
				},
				error: ''
			}
		});
	} catch (err) {
		dispatch({
			type: SubjectActionTypes.FETCH_ALL_SUBJECTS_FAILURE,
			payload: {
				data: {
					selectedSubject: null,
					subjects: [],
					toggleAdd: false
				},
				error: err.message
			}
		});
	}
};

export const fetchAllSubjectsByTutors = () => async (dispatch: (arg: ActionPayload) => void) => {
	try {
		const snapshot = await fsdb.collection('subjects').orderBy('label').get();
		const subjects: any[] = snapshot.docs.map(async (doc) => {
			const subject = doc.data();
			const tutorsRef = await fsdb.collection('tutors').where('subjects', 'array-contains', doc.id).get();
			const tutors = tutorsRef.docs.map((tutorDoc) => ({
				name: `${tutorDoc.data().first_name} ${tutorDoc.data().last_name}`,
				uid: tutorDoc.id
			}));
			return {
				label: subject.label,
				full: subject.full,
				tutors,
				id: doc.id
			} as Subject;
		});

		const results = await Promise.all(subjects);

		dispatch({
			type: SubjectActionTypes.FETCH_ALL_SUBJECTS_SUCCESS,
			payload: {
				data: {
					selectedSubject: null,
					subjects: results,
					toggleAdd: false
				},
				error: ''
			}
		});
	} catch (err) {
		dispatch({
			type: SubjectActionTypes.FETCH_ALL_SUBJECTS_FAILURE,
			payload: {
				data: {
					selectedSubject: null,
					subjects: [],
					toggleAdd: false
				},
				error: err.message
			}
		});
	}
};

export const selectAndUpdateSubject = (subject: Subject) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SubjectActionTypes.SELECT_AND_UPDATE_SUBJECT,
		payload: {
			data: {
				selectedSubject: subject,
				subjects: [],
				toggleAdd: false
			},
			error: ''
		}
	});
};

export const toggleAddSubject = (on: boolean) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SubjectActionTypes.TOGGLE_ADD,
		payload: {
			data: {
				selectedSubject: empty,
				subjects: [],
				toggleAdd: on
			},
			error: ''
		}
	});
};

export const updateSubject = (subject: Subject, subjects: Subject[]) => (
	dispatch: (arg: ActionPayload) => void
): Promise<void> => {
	const { id, ...update } = subject;

	return new Promise((resolve, reject) => {
		fsdb
			.collection('subjects')
			.doc(subject.id)
			.update(update)
			.then(() => {
				const index = subjects.findIndex((st) => st.id === subject.id);
				const all = [ ...subjects ];
				all[index] = { ...subject };
				dispatch({
					type: SubjectActionTypes.UPDATE_SUCCESS,
					payload: {
						data: {
							selectedSubject: null,
							subjects: all,
							toggleAdd: false
						},
						error: ''
					}
				});
				resolve();
			})
			.catch((err) => {
				dispatch({
					type: SubjectActionTypes.UPDATE_FAILURE,
					payload: {
						data: {
							selectedSubject: null,
							subjects: [],
							toggleAdd: false
						},
						error: err.message
					}
				});
				reject(err);
			});
	});
};

export const addSubject = (subject: Subject, subjects: Subject[]) => (
	dispatch: (arg: ActionPayload) => void
): Promise<void> => {
	const { id, ...add } = subject;
	return new Promise((resolve, reject) => {
		fsdb
			.collection('subjects')
			.add(add)
			.then((docRef) => {
				const clone = { ...subject };
				clone.id = docRef.id;
				subjects.push(clone);
				const sorted = arraySort(subjects, 'label');
				dispatch({
					type: SubjectActionTypes.ADD_SUCCESS,
					payload: {
						data: {
							selectedSubject: null,
							subjects: sorted,
							toggleAdd: false
						},
						error: ''
					}
				});
				resolve();
			})
			.catch((err) => {
				dispatch({
					type: SubjectActionTypes.ADD_FAILURE,
					payload: {
						data: {
							selectedSubject: null,
							subjects: [],
							toggleAdd: false
						},
						error: err.message
					}
				});
				reject(err);
			});
	});
};

export const resetSubject = (id: string, data: Subject[]) => (dispatch: (arg: ActionPayload) => void) => {
	const oldSubject = data.filter((subject) => subject.id === id)[0];
	dispatch({
		type: SubjectActionTypes.SELECT_AND_UPDATE_SUBJECT,
		payload: {
			data: {
				selectedSubject: oldSubject,
				subjects: [],
				toggleAdd: false
			},
			error: ''
		}
	});
};

export const deleteSubject = (id: string, data: Subject[]) => (dispatch: (arg: ActionPayload) => void) => {
	fsdb
		.collection('subjects')
		.doc(id)
		.delete()
		.then(() => {
			const newSubjects = data.filter((subject) => subject.id !== id);

			// 	// Remove removed subject from tutor's subjects
			// 	try {
			// 		const snapshot = await fsdb.collection('tutors').get();
			// 		snapshot.docs.forEach((doc) => {
			// 			if (doc.exists) {
			// 				const tutorId = doc.id;
			// 				const tutorSubjects = [ ...doc.data().subjects ];
			// 				if (tutorSubjects.includes(id)) {
			// 					const update = {
			// 						subjects: tutorSubjects.filter((sj: string) => sj !== id)
			// 					};
			// 					fsdb
			// 						.collection('tutors')
			// 						.doc(tutorId)
			// 						.update(update)
			// 						.then(() =>
			// 							dispatch({
			// 								type: SubjectActionTypes.DELETE_SUCCESS,
			// 								payload: {
			// 									data: {
			// 										selectedSubject: null,
			// 										subjects: newSubjects,
			// 										toggleAdd: false
			// 									},
			// 									error: ''
			// 								}
			// 							})
			// 						)
			// 						.catch((err) =>
			// 							dispatch({
			// 								type: SubjectActionTypes.DELETE_FAILURE,
			// 								payload: {
			// 									data: {
			// 										selectedSubject: null,
			// 										subjects: [],
			// 										toggleAdd: false
			// 									},
			// 									error: err.message
			// 								}
			// 							})
			// 						);
			// 				}
			// 			}
			// 		});
			// 		dispatch({
			// 			type: SubjectActionTypes.DELETE_SUCCESS,
			// 			payload: {
			// 				data: {
			// 					selectedSubject: null,
			// 					subjects: newSubjects,
			// 					toggleAdd: false
			// 				},
			// 				error: ''
			// 			}
			// 		});
			// 	} catch (err) {
			// 		dispatch({
			// 			type: SubjectActionTypes.DELETE_FAILURE,
			// 			payload: {
			// 				data: {
			// 					selectedSubject: null,
			// 					subjects: [],
			// 					toggleAdd: false
			// 				},
			// 				error: err.message
			// 			}
			// 		});
			// 	}
			//

			dispatch({
				type: SubjectActionTypes.DELETE_SUCCESS,
				payload: {
					data: {
						selectedSubject: null,
						subjects: newSubjects,
						toggleAdd: false
					},
					error: ''
				}
			});
		})
		.catch((err) => {
			dispatch({
				type: SubjectActionTypes.DELETE_FAILURE,
				payload: {
					data: {
						selectedSubject: null,
						subjects: [],
						toggleAdd: false
					},
					error: err.message
				}
			});
		});
};

export const clearStore = () => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SubjectActionTypes.CLEAR_STORE,
		payload: {
			data: {
				selectedSubject: null,
				subjects: [],
				toggleAdd: false
			},
			error: ''
		}
	});
}