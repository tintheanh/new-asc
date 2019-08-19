export enum AppointmentActionTypes {
	FETCH_ALL_SUCCESS = '@@apointment/FETCH_ALL_SUCCESS',
	FETCH_ALL_FAILURE = '@@appointment/FETCH_ALL_FAILURE',

	FETCH_TODAY_SUCCESS = '@@appointment/FETCH_TODAY_SUCCESS',
	FETCH_TODAY_FAILTURE = '@@appointment/FETCH_TODAY_FAILTURE',

	STUDENT_CHECK_APPOINTMENT_SUCCESS = '@@appointment/STUDENT_CHECK_APPOINTMENT_SUCCESS',
	STUDENT_CHECK_APPOINTMENT_FAILURE = '@@appointment/STUDENT_CHECK_APPOINTMENT_FAILURE',

	SELECT_APPOINTMENT = '@@appointment/SELECT_APPOINTMENT',

	REMOVE_APPOINTMENT_SUCCESS = '@@appointment/REMOVE_APPOINTMENT_SUCCESS',
	REMOVE_APPOINTMENT_FAILURE = '@@appointment/REMOVE_APPOINTMENT_FAILURE',

	SET_DATE_FROM_FILTER = '@@appointment/SET_DATE_FROM_FILTER',
	SET_DATE_TO_FILTER = '@@appointment/SET_DATE_TO_FILTER',

	SET_STUDENT_FILTER = '@@appointment/SET_STUDENT_FILTER',
	SET_TUTOR_FILTER = '@@appointment/SET_TUTOR_FILTER',
	SET_SUBJECT_FILTER = '@@appointment/SET_SUBJECT_FILTER',

	SET_DAY_FILTER = '@@appointment/SET_DAY_FILTER',
	REMOVE_DAY_FILTER = '@appointment/REMOVE_DAY_FILTER',

	SET_TYPE_FILTER = '@@appointment/SET_TYPE_FILTER',
	REMOVE_TYPE_FILTER = '@@appointment/REMOVE_TYPE_FILTER',

	FETCH_TUTORS_FILTER_SUCCESS = '@@appointment/FETCH_TUTORS_FILTER_SUCCESS',
	FETCH_TUTORS_FILTER_FAILURE = '@@appointment/FETCH_TUTORS_FILTER_FAILURE',

	APPLY_FILTER = '@@appointment/APPLY_FILTER',
	CLEAR_FILTER = '@@appointment/CLEAR_FILTER',

	CLEAR_STORE = '@@appointment/CLEAR_STORE'
}

export interface Appointment {
	id: string;
	apptDate: string;
	status: string;
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
		todayAppointments: any[];
		studentPrompt: string;
		appointments: any;
		filteredAppointments: any[];
		selectedAppointment: any;
		toggleFilter: boolean;
		filter: {
			dateFilter: any[];
			tutors: any[];
			tutor: any;
			subject: any;
			student: any;
			days: any;
			type: any;
		};
	};
	error: string;
}

export interface ActionPayload {
	type: string;
	payload: AppointmentState;
}
