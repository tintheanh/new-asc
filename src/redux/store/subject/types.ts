export enum SubjectActionTypes {
	FETCH_ALL_SUBJECTS_SUCCESS = '@@subject/FETCH_ALL_SUBJECTS_SUCCESS',
	FETCH_ALL_SUBJECTS_FAILURE = '@@subject/FETCH_ALL_SUBJECTS_FAILURE',

	SELECT_AND_UPDATE_SUBJECT = '@@subject/SELECT_AND_UPDATE_SUBJECT',

	TOGGLE_ADD = '@@subject/TOGGLE_ADD',

	UPDATE_SUCCESS = '@@subject/UPDATE_SUCCESS',
	UPDATE_FAILURE = '@@subject/UPDATE_FAILURE',

	ADD_SUCCESS = '@@subject/ADD_SUCCESS',
	ADD_FAILURE = '@@subject/ADD_FAILURE',

	DELETE_SUCCESS = '@@subject/DELETE_SUCCESS',
	DELETE_FAILURE = '@@subject/DELETE_FAILURE',

	CLEAR_STORE = '@@subject/CLEAR_STORE'
}

export const empty = {
	id: '',
	label: '',
	full: ''
};

export interface Subject {
	id: string;
	label: string;
	full: string;
}

export interface ActionPayload {
	type: string;
	payload: SubjectState;
}

export interface SubjectState {
	data: {
		selectedSubject: Subject | null;
		subjects: Subject[];
		toggleAdd: boolean;
	};
	error: string;
}
