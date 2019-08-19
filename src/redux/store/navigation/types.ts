export enum NavigationActionTypes {
	NAVIGATE = '@@navigate/NAVIGATE',

	TUTOR_REPORT_OPTION = '@@navigate/TUTOR_REPORT_OPTION',
	SUBJECT_REPORT_OPTION = '@@navigate/SUBJECT_REPORT_OPTION',
	APPOINTMENT_REPORT_OPTION = '@@navigate/APPOINTMENT_REPORT_OPTION',

	SET_SIGNIN_ID = '@@navigate/SET_SIGNIN_ID',
	CLEAR_SIGNIN_ID = '@@navigate/CLEAR_SIGNIN_ID',

	TOGGLE_MAIN_TUTOR_MODAL = '@@navigate/TOGGLE_MAIN_TUTOR_MODAL',
	TOGGLE_STUDENT_REGISTER_MODAL = '@@navigate/TOGGLE_STUDENT_REGISTER_MODAL',
	TOGGLE_TUTOR_DATEPICKER_MODAL = '@@navigate/TOGGLE_TUTOR_DATEPICKER_MODAL',
	TOGGLE_STUDENT_APPOINTMENT_MODAL = '@@navigate/TOGGLE_STUDENT_APPOINTMENT_MODAL'
}

export interface ActionPayload {
	type: string;
	payload: NavigationState;
}

export interface NavigationState {
	route: string;
	tutorReportOption: string;
	subjectReportOption: string;
	appointmentReportOption: string;
	signInId: string;
	mainTutorModal: boolean;
	studentRegisterModal: boolean;
	studentAppointmentModal: boolean;
	studentAppointmentChecking: any;
	tutorDatePickerModal: boolean;
}
