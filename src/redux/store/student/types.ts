export enum StudentActionTypes {
	FETCH_ALL_SUCCESS = '@@student/FETCH_ALL_SUCCESS',
	FETCH_ALL_FAILURE = '@@student/FETCH_ALL_FAILTURE',

	STUDENT_LOGIN_SUCCESS = '@@student/STUDENT_LOGIN_SUCCESS',
	STUDENT_LOGIN_FAILURE = '@@student/STUDENT_LOGIN_FAILURE',

	REGISTER_SUCCESS = '@@student/REGISTER_SUCCESS',
	REGISTER_FAILTURE = '@@student/REGISTER_FAILTURE',

	SELECT_AND_UPDATE_STUDENT = '@@student/SELECT_AND_UPDATE_STUDENT',

	UPDATE_SUCCESS = '@@student/UPDATE_SUCCESS',
	UPDATE_FAILURE = '@@student/UPDATE_FAILURE',

	TOGGLE_ADD = '@@student/TOGGLE_ADD',

	ADD_SUCCESS = '@@student/ADD_SUCCESS',
	ADD_FAILURE = '@@student/ADD_FAILURE',

	CLEAR = '@@student/CLEAR',

	DELETE_SUCCESS = '@@student/DELETE_SUCCESS',
	DELETE_FAILURE = '@@student/DELETE_FAILURE',

	SEARCH_STUDENT = '@@student/SEARCH_STUDENT'
}

export const empty = {
	uid: '',
	studentId: '',
	first_name: '',
	last_name: '',
	email: '',
	active: false
};

export interface Student {
	uid: string;
	studentId: string;
	first_name: string;
	last_name: string;
	email: string;
	active: boolean;
}

export interface StudentState {
	data: {
		student: Student | null;
		students: Student[];
		selectedStudent: Student | null;
		searchToken: string;
		toggleAdd: boolean;
	};
	error: string;
}

export interface ActionPayload {
	type: string;
	payload: StudentState;
}
