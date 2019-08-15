export enum NavigationActionTypes {
	NAVIGATE = '@@navigate/NAVIGATE',

	REPORT_OPTION = '@@navigate/REPORT_OPTION',

	SET_SIGNIN_ID = '@@navigate/SET_SIGNIN_ID',
	CLEAR_SIGNIN_ID = '@@navigate/CLEAR_SIGNIN_ID',

	TOGGLE_MAIN_TUTOR_MODAL = '@@navigate/TOGGLE_MAIN_TUTOR_MODAL',
	TOGGLE_STUDENT_REGISTER_MODAL = '@@navigate/TOGGLE_STUDENT_REGISTER_MODAL',
	TOGGLE_TUTOR_DATEPICKER_MODAL = '@@navigate/TOGGLE_TUTOR_DATEPICKER_MODAL'
}

export interface ActionPayload {
	type: string;
	payload: NavigationState;
}

export interface NavigationState {
	route: string;
	reportOption: string;
	signInId: string;
	mainTutorModal: boolean;
	studentRegisterModal: boolean;
	tutorDatePickerModal: boolean;
}
