export enum SubjectActionTypes {
	FETCH_ALL_SUBJECTS_SUCCESS = '@@subject/FETCH_ALL_SUBJECTS_SUCCESS',
	FETCH_ALL_SUBJECTS_FAILURE = '@@subject/FETCH_ALL_SUBJECTS_FAILURE'
}

export interface Subject {
	label: string;
	full: string;
	id: string;
}

export interface ActionPayload {
	type: string;
	payload: {
		data: Subject[];
		error: string;
	};
}

export interface SubjectState {
	subjects: Subject[];
	error: string;
}
