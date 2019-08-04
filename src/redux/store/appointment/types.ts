export enum AppointmentActionTypes {
	FETCH_ALL_SUCCESS = '@@apointment/FETCH_ALL_SUCCESS',
	FETCH_ALL_FAILURE = '@@appointment/FETCH_ALL_FAILURE'
}

export interface Appointment {
	id: string;
	apptDate: string;
	student: {
		uid: string;
		first_name: string;
		last_name: string;
	};
	subject: {
    id: string;
    studentId: string;
		label: string;
		full: string;
	};
	time: {
		from: string;
		to: string;
	};
	tutor: {
		uid: string;
		first_name: string;
		last_name: string;
	};
}

export interface AppointmentState {
	data: {
		appointments: Appointment[];
		selectedAppointment: Appointment | null;
	};
	error: string;
}

export interface ActionPayload {
	type: string;
	payload: AppointmentState;
}
