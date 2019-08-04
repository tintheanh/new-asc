export enum TutorActionTypes {
	FETCH_ALL_SUCCESS = '@@tutor/FETCH_ALL_SUCCESS',
	FETCH_ALL_FAILURE = '@@tutor/FETCH_ALL_FAILURE',
	FETCH_SUCCESS = '@@tutor/FETCH_SUCCESS',
	FETCH_ERROR = '@@tutor/FETCH_ERROR',

	CLEAR_SUCCESS = '@@tutor/CLEAR_SUCCESS',
	CLEAR_FAILURE = '@@tutor/CLEAR_FAILURE',

	CLOCKIN_SUCCESS = '@@tutor/CLOCKIN_SUCCESS',
	CLOCKIN_FAILURE = '@@tutor/CLOCKIN_FAILURE',
	CLOCKOUT_SUCCESS = '@@tutor/CLOCKOUT_SUCCESS',
	CLOCKOUT_FAILURE = '@@tutor/CLOCKOUT_FAILURE',

	UPDATE_SUCCESS = '@@tutor/UPDATE_SUCCESS',
	UPDATE_FAILURE = '@@tutor/UPDATE_FAILURE',

	ADD_SUCCESS = '@@tutor/ADD_SUCCESS',
	ADD_FAILURE = '@@tutor/ADD_FAILURE',

	DELETE_SUCCESS = '@@tutor/DELETE_SUCCESS',
	DELETE_FAILURE = '@@tutor/DELETE_FAILURE',

	SELECT_AND_UPDATE_TUTOR = '@@tutor/SELECT_AND_UPDATE_TUTOR',

	TOGGLE_ADD = '@@tutor/TOGGLE_ADD',

	CLEAR = '@@tutor/CLEAR'
}

export const empty: Tutor = {
	uid: '',
	staff_id: '',
	active: false,
	is_admin: false,
	first_name: '',
	last_name: '',
	email: '',
	subjects: [],
	off_time: [],
	work_schedule: [ [], [], [], [], [], [], [] ],
	current_log: 0,
	work_track: {}
};

export interface Schedule {
	from: {
		time: string;
		order: number;
	};
	to: {
		time: string;
		order: number;
	};
}

export interface Tutor {
	uid: string;
	staff_id: string;
	active: boolean;
	is_admin: boolean;
	first_name: string;
	last_name: string;
	email: string;
	subjects: {
		label: string;
		full: string;
		id: string;
	}[];
	off_time: [];
	work_schedule: Schedule[][];
	current_log: number;
	work_track: {
		[date: string]: {
			[time: string]: {
				in: number;
				out: number;
			};
		};
	};
}

export interface TutorState {
	data: {
		tutor: Tutor | null;
		tutors: Tutor[];
		selectedTutor: Tutor | null;
		toggleAdd: boolean;
	};
	error: string;
}

export interface ActionPayload {
	type: string;
	payload: TutorState;
}
