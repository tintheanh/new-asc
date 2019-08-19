import { NavigationActionTypes, NavigationState, ActionPayload } from './types';

const initialState = {
	route: 'Users',
	tutorReportOption: 'Tutor Info',
	subjectReportOption: 'Subject List',
	appointmentReportOption: 'Appointment By Tutor',
	signInId: '',
	mainTutorModal: false,
	studentRegisterModal: false,
	studentAppointmentModal: false,
	studentAppointmentChecking: null,
	tutorDatePickerModal: false
};

const NavigationReducer = (state: NavigationState = initialState, action: ActionPayload): NavigationState => {
	switch (action.type) {
		case NavigationActionTypes.NAVIGATE:
			return {
				...state,
				route: action.payload.route
			};
		case NavigationActionTypes.TUTOR_REPORT_OPTION:
			return {
				...state,
				tutorReportOption: action.payload.tutorReportOption
			};
		case NavigationActionTypes.SUBJECT_REPORT_OPTION:
			return {
				...state,
				subjectReportOption: action.payload.subjectReportOption
			};
		case NavigationActionTypes.APPOINTMENT_REPORT_OPTION:
			return {
				...state,
				appointmentReportOption: action.payload.appointmentReportOption
			};
		case NavigationActionTypes.SET_SIGNIN_ID:
			return {
				...state,
				signInId: action.payload.signInId
			};
		case NavigationActionTypes.CLEAR_SIGNIN_ID:
			return {
				...state,
				signInId: action.payload.signInId
			};
		case NavigationActionTypes.TOGGLE_MAIN_TUTOR_MODAL:
			return {
				...state,
				mainTutorModal: action.payload.mainTutorModal
			};
		case NavigationActionTypes.TOGGLE_STUDENT_REGISTER_MODAL:
			return {
				...state,
				studentRegisterModal: action.payload.studentRegisterModal
			};
		case NavigationActionTypes.TOGGLE_STUDENT_APPOINTMENT_MODAL:
			return {
				...state,
				studentAppointmentModal: action.payload.studentAppointmentModal,
				studentAppointmentChecking: action.payload.studentAppointmentChecking
			};
		case NavigationActionTypes.TOGGLE_TUTOR_DATEPICKER_MODAL:
			return {
				...state,
				tutorDatePickerModal: action.payload.tutorDatePickerModal
			};
		default:
			return { ...state };
	}
};

export default NavigationReducer;
