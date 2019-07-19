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

	CLEAR_ERROR = '@@tutor/CLEAR_ERROR'
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
	work_schedule: [];
	appointments: string[];
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
		tutors: Tutor[] | null;
	};
	error: string;
}

interface Payload {
	data: {
		tutor: Tutor | null;
		tutors: Tutor[] | null;
	};
	error: string;
}

export interface ActionPayload {
	type: string;
	payload: Payload;
}
