import { NavigationActionTypes, NavigationState, ActionPayload } from './types';

const initialState = {
	route: 'Users',
	reportOption: 'Tutor Info',
	signInId: '',
	mainTutorModal: false,
	studentRegisterModal: false,
	tutorDatePickerModal: false
};

const NavigationReducer = (state: NavigationState = initialState, action: ActionPayload): NavigationState => {
	switch (action.type) {
		case NavigationActionTypes.NAVIGATE:
			return {
				...state,
				route: action.payload.route
			};
		case NavigationActionTypes.REPORT_OPTION:
			return {
				...state,
				reportOption: action.payload.reportOption
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
