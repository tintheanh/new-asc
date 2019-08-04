import { fsdb, auth, functions } from 'index';
import { StudentActionTypes, Student, ActionPayload, empty } from './types';

const fetchStudent = (uid: string): Promise<Student> => {
	return new Promise(async (resolve, reject) => {
		try {
			const doc = await fsdb.collection('students').doc(uid).get();
			if (doc.exists) {
				const objFs = doc.data();

				const student = {
					uid: doc.id,
					studentId: objFs!.studentId,
					active: objFs!.active,
					first_name: objFs!.first_name,
					last_name: objFs!.last_name,
					email: objFs!.email
				};
				resolve(student);
			} else {
				reject(new Error('Could not find data.'));
			}
		} catch (err) {
			reject(err);
		}
	});
};

export const fetchAllStudents = () => async (dispatch: (arg: ActionPayload) => void) => {
	try {
		const snapshot = await fsdb.collection('students').get();
		const students: Student[] = await Promise.all(
			snapshot.docs.map((doc) => {
				if (doc.exists) {
					const studentId = doc.id;
					return fetchStudent(studentId);
				}
				return new Promise((resolve) => resolve());
			})
		);
		dispatch({
			type: StudentActionTypes.FETCH_ALL_SUCCESS,
			payload: {
				data: {
					student: null,
					students,
					selectedStudent: null,
					toggleAdd: false
				},
				error: ''
			}
		});
	} catch (err) {
		dispatch({
			type: StudentActionTypes.FETCH_ALL_FAILURE,
			payload: {
				data: {
					student: null,
					students: [],
					selectedStudent: null,
					toggleAdd: false
				},
				error: err.message
			}
		});
	}
};

export const studentRegister = (student: Student) => (dispatch: (arg: ActionPayload) => void): Promise<void> => {
	const { uid, ...forFs } = student;
	return new Promise(async (resolve, reject) => {
		try {
			const userData = await auth.createUserWithEmailAndPassword(`${student.studentId}@asc.com`, 'asc1234');
			if (userData && userData.user) {
				const { uid } = userData.user;
				fsdb
					.collection('students')
					.doc(uid)
					.set(forFs)
					.then(() => {
						dispatch({
							type: StudentActionTypes.REGISTER_SUCCESS,
							payload: {
								data: {
									student: null,
									students: [],
									selectedStudent: null,
									toggleAdd: false
								},
								error: ''
							}
						});
						resolve();
					})
					.catch((err) => {
						dispatch({
							type: StudentActionTypes.REGISTER_FAILTURE,
							payload: {
								data: {
									student: null,
									students: [],
									selectedStudent: null,
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
				type: StudentActionTypes.REGISTER_FAILTURE,
				payload: {
					data: {
						student: null,
						students: [],
						selectedStudent: null,
						toggleAdd: false
					},
					error: err.message
				}
			});
			reject(err);
		}
	});
};

export const selectAndUpdateStudent = (student: Student) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: StudentActionTypes.SELECT_AND_UPDATE_STUDENT,
		payload: {
			data: {
				student: null,
				students: [],
				selectedStudent: student,
				toggleAdd: false
			},
			error: ''
		}
	});
};

export const resetStudent = (uid: string, data: Student[]) => (dispatch: (arg: ActionPayload) => void) => {
	const oldStudent = data.filter((student) => student.uid === uid)[0];
	dispatch({
		type: StudentActionTypes.SELECT_AND_UPDATE_STUDENT,
		payload: {
			data: {
				student: null,
				students: [],
				selectedStudent: oldStudent,
				toggleAdd: false
			},
			error: ''
		}
	});
};

export const updateStudent = (student: Student, students: Student[]) => (
	dispatch: (arg: ActionPayload) => void
): Promise<void> => {
	const { uid, ...update } = student;

	return new Promise((resolve, reject) => {
		fsdb
			.collection('students')
			.doc(student.uid)
			.update(update)
			.then(() => {
				const index = students.findIndex((st) => st.uid === student.uid);
				const all = [ ...students ];
				all[index] = { ...student };
				dispatch({
					type: StudentActionTypes.UPDATE_SUCCESS,
					payload: {
						data: {
							student: null,
							students: all,
							selectedStudent: null,
							toggleAdd: false
						},
						error: ''
					}
				});
				resolve();
			})
			.catch((err) => {
				dispatch({
					type: StudentActionTypes.UPDATE_FAILURE,
					payload: {
						data: {
							student: null,
							students: [],
							selectedStudent: null,
							toggleAdd: false
						},
						error: err.message
					}
				});
				reject(err);
			});
	});
};

export const toggleAddStudent = (on: boolean) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: StudentActionTypes.TOGGLE_ADD,
		payload: {
			data: {
				student: null,
				students: [],
				selectedStudent: empty,
				toggleAdd: on
			},
			error: ''
		}
	});
};

export const addStudent = (student: Student, students: Student[]) => (
	dispatch: (arg: ActionPayload) => void
): Promise<void> => {
	const { uid, ...add } = student;
	return new Promise(async (resolve, reject) => {
		try {
			const userData = await auth.createUserWithEmailAndPassword(`${student.studentId}@asc.com`, 'asc1234');
			if (userData && userData.user) {
				const { uid } = userData.user;
				const clone = { ...student };
				clone.uid = uid;
				students.push(clone);
				fsdb
					.collection('students')
					.doc(uid)
					.set(add)
					.then(() => {
						dispatch({
							type: StudentActionTypes.ADD_SUCCESS,
							payload: {
								data: {
									student: null,
									students,
									selectedStudent: null,
									toggleAdd: false
								},
								error: ''
							}
						});
						resolve();
					})
					.catch((err) => {
						dispatch({
							type: StudentActionTypes.ADD_FAILURE,
							payload: {
								data: {
									student: null,
									students: [],
									selectedStudent: null,
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
				type: StudentActionTypes.ADD_FAILURE,
				payload: {
					data: {
						student: null,
						students: [],
						selectedStudent: null,
						toggleAdd: false
					},
					error: err.message
				}
			});
			reject(err);
		}
	});
};

export const clear = () => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: StudentActionTypes.CLEAR,
		payload: {
			data: {
				student: null,
				students: [],
				selectedStudent: null,
				toggleAdd: false
			},
			error: ''
		}
	});
};

export const deleteStudent = (uid: string, data: Student[]) => (dispatch: (arg: ActionPayload) => void) => {
	const deleteFunc = functions.httpsCallable('deleteUser');
	deleteFunc({ uid })
		.then(() => {
			fsdb
				.collection('students')
				.doc(uid)
				.delete()
				.then(() => {
					const newStudents = data.filter((student) => student.uid !== uid);
					dispatch({
						type: StudentActionTypes.DELETE_SUCCESS,
						payload: {
							data: {
								student: null,
								students: newStudents,
								selectedStudent: null,
								toggleAdd: false
							},
							error: ''
						}
					});
				})
				.catch((err) =>
					dispatch({
						type: StudentActionTypes.DELETE_FAILURE,
						payload: {
							data: {
								student: null,
								students: [],
								selectedStudent: null,
								toggleAdd: false
							},
							error: err.message
						}
					})
				);
		})
		.catch((err) =>
			dispatch({
				type: StudentActionTypes.DELETE_FAILURE,
				payload: {
					data: {
						student: null,
						students: [],
						selectedStudent: null,
						toggleAdd: false
					},
					error: err.message
				}
			})
		);
};
