export enum TutorActionTypes {
	FETCH_SUCCESS = '@@tutor/FETCH_SUCCESS',
	FETCH_ERROR = '@@tutor/FETCH_ERROR',
	CLEAR_SUCCESS = '@@tutor/CLEAR_SUCCESS',
	CLEAR_FAILURE = '@@tutor/CLEAR_FAILURE',
	CLOCKIN_SUCCESS = '@@tutor/CLOCKIN_SUCCESS',
	CLOCKIN_FAILURE = '@@tutor/CLOCKIN_FAILURE',
	CLOCKOUT_SUCCESS = '@@tutor/CLOCKOUT_SUCCESS',
	CLOCKOUT_FAILURE = '@@tutor/CLOCKOUT_FAILURE'
}

export interface Tutor {
	uid: string;
	staff_id: string;
	active: boolean;
	is_admin: boolean;
	name: string;
	email: string;
	subjects: {
		label: string;
		full: string;
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
	readonly data: Tutor | null;
	readonly error: string;
}

interface Payload {
	data: Tutor;
	error: string;
}

export interface ActionPayload {
	type: string;
	payload: Payload;
}
