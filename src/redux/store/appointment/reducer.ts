import { AppointmentActionTypes, AppointmentState, ActionPayload } from './types';

const initialState = {
	data: {
		appointments: [],
		selectedAppointment: null
	},
	error: ''
};

const AppointmentReducer = (state: AppointmentState = initialState, action: ActionPayload): AppointmentState => {
	switch (action.type) {
		case AppointmentActionTypes.FETCH_ALL_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					appointments: action.payload.data.appointments
				}
			};
		case AppointmentActionTypes.FETCH_ALL_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		default:
			return { ...state };
	}
};

export default AppointmentReducer;
