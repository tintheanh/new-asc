import { TutorActionTypes, TutorState, ActionPayload } from './types';

const initialState = {
	data: null,
	error: ''
};

const TutorReducer = (state: TutorState = initialState, action: ActionPayload): TutorState => {
	switch (action.type) {
		case TutorActionTypes.FETCH_SUCCESS:
			return {
				...state,
				data: action.payload.data
			};
		case TutorActionTypes.FETCH_ERROR:
			return {
				...state,
				error: action.payload.error
			};
		case TutorActionTypes.CLEAR_SUCCESS:
			return { ...initialState };
		case TutorActionTypes.CLEAR_FAILURE:
			return { ...state, error: action.payload.error };
		case TutorActionTypes.CLOCKIN_SUCCESS:
			return {
				...state,
				data: action.payload.data
			};
		case TutorActionTypes.CLOCKIN_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case TutorActionTypes.CLOCKOUT_SUCCESS:
			return {
				...state,
				data: action.payload.data
			};
		case TutorActionTypes.CLOCKOUT_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		default:
			return { ...initialState };
	}
};

export default TutorReducer;
