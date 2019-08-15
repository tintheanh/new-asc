import { NavigationActionTypes, ActionPayload } from './types';

export const onChangeRoute = (route: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.NAVIGATE,
		payload: {
			route,
			reportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			tutorDatePickerModal: false
		}
	});
};

export const onChangeReportOption = (option: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.REPORT_OPTION,
		payload: {
			route: '',
			reportOption: option,
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			tutorDatePickerModal: false
		}
	});
};

export const setSignInId = (id: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.SET_SIGNIN_ID,
		payload: {
			route: '',
			reportOption: '',
			signInId: id,
			mainTutorModal: false,
			studentRegisterModal: false,
			tutorDatePickerModal: false
		}
	});
};

export const clearSignInId = () => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.CLEAR_SIGNIN_ID,
		payload: {
			route: '',
			reportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			tutorDatePickerModal: false
		}
	});
};

export const toggleMainTutorModal = (toggle: boolean) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.TOGGLE_MAIN_TUTOR_MODAL,
		payload: {
			route: '',
			reportOption: '',
			signInId: '',
			studentRegisterModal: false,
			mainTutorModal: toggle,
			tutorDatePickerModal: false
		}
	});
};

export const toggleStudentRegisterModal = (toggle: boolean) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.TOGGLE_STUDENT_REGISTER_MODAL,
		payload: {
			route: '',
			reportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: toggle,
			tutorDatePickerModal: false
		}
	});
};

export const toggleTutorDatePickerModal = (toggle: boolean) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.TOGGLE_TUTOR_DATEPICKER_MODAL,
		payload: {
			route: '',
			reportOption: '',
			signInId: '',
			mainTutorModal: false,
			studentRegisterModal: false,
			tutorDatePickerModal: toggle
		}
	});
};
