import { NavigationActionTypes, ActionPayload } from './types';

export const onChangeRoute = (route: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.NAVIGATE,
		payload: {
			route,
			tutorReportOption: '',
			subjectReportOption: '',
			appointmentReportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			studentAppointmentModal: false,
			studentAppointmentChecking: null,
			tutorDatePickerModal: false
		}
	});
};

export const onChangeTutorReportOption = (option: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.TUTOR_REPORT_OPTION,
		payload: {
			route: '',
			tutorReportOption: option,
			subjectReportOption: '',
			appointmentReportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			studentAppointmentModal: false,
			studentAppointmentChecking: null,
			tutorDatePickerModal: false
		}
	});
};

export const onChangeSubjectReportOption = (option: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.SUBJECT_REPORT_OPTION,
		payload: {
			route: '',
			tutorReportOption: '',
			subjectReportOption: option,
			appointmentReportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			studentAppointmentModal: false,
			studentAppointmentChecking: null,
			tutorDatePickerModal: false
		}
	});
};

export const onChangeAppointmentReportOption = (option: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.APPOINTMENT_REPORT_OPTION,
		payload: {
			route: '',
			tutorReportOption: '',
			subjectReportOption: '',
			appointmentReportOption: option,
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			studentAppointmentModal: false,
			studentAppointmentChecking: null,
			tutorDatePickerModal: false
		}
	});
};

export const setSignInId = (id: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.SET_SIGNIN_ID,
		payload: {
			route: '',
			tutorReportOption: '',
			subjectReportOption: '',
			appointmentReportOption: '',
			signInId: id,
			mainTutorModal: false,
			studentRegisterModal: false,
			studentAppointmentModal: false,
			studentAppointmentChecking: null,
			tutorDatePickerModal: false
		}
	});
};

export const clearSignInId = () => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.CLEAR_SIGNIN_ID,
		payload: {
			route: '',
			tutorReportOption: '',
			subjectReportOption: '',
			appointmentReportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			studentAppointmentModal: false,
			studentAppointmentChecking: null,
			tutorDatePickerModal: false
		}
	});
};

export const toggleMainTutorModal = (toggle: boolean) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.TOGGLE_MAIN_TUTOR_MODAL,
		payload: {
			route: '',
			tutorReportOption: '',
			subjectReportOption: '',
			appointmentReportOption: '',
			signInId: '',
			studentRegisterModal: false,
			studentAppointmentModal: false,
			mainTutorModal: toggle,
			studentAppointmentChecking: null,
			tutorDatePickerModal: false
		}
	});
};

export const toggleStudentRegisterModal = (toggle: boolean) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.TOGGLE_STUDENT_REGISTER_MODAL,
		payload: {
			route: '',
			tutorReportOption: '',
			subjectReportOption: '',
			appointmentReportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: toggle,
			studentAppointmentModal: false,
			studentAppointmentChecking: null,
			tutorDatePickerModal: false
		}
	});
};

export const toggleStudentAppointmentModal = (toggle: boolean, appt: any) => (
	dispatch: (arg: ActionPayload) => void
) => {
	dispatch({
		type: NavigationActionTypes.TOGGLE_STUDENT_APPOINTMENT_MODAL,
		payload: {
			route: '',
			tutorReportOption: '',
			subjectReportOption: '',
			appointmentReportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			studentAppointmentModal: toggle,
			studentAppointmentChecking: appt,
			tutorDatePickerModal: false
		}
	});
};

export const toggleTutorDatePickerModal = (toggle: boolean) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.TOGGLE_TUTOR_DATEPICKER_MODAL,
		payload: {
			route: '',
			tutorReportOption: '',
			subjectReportOption: '',
			appointmentReportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			studentAppointmentModal: false,
			studentAppointmentChecking: null,
			tutorDatePickerModal: toggle
		}
	});
};
