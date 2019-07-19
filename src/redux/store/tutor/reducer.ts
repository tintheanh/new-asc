import { TutorActionTypes, TutorState, ActionPayload } from './types';

const initialState = {
	data: {
		tutor: null,
		tutors: null
	},
	error: ''
};

const TutorReducer = (state: TutorState = initialState, action: ActionPayload): TutorState => {
	switch (action.type) {
		case TutorActionTypes.FETCH_SUCCESS:
			return {
				...state,
				data: {
					tutor: action.payload.data.tutor,
					tutors: null
				}
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
				data: {
					tutor: action.payload.data.tutor,
					tutors: null
				}
			};
		case TutorActionTypes.CLOCKIN_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case TutorActionTypes.CLOCKOUT_SUCCESS:
			// Clock out function has time interval validation, may return error though still successful.
			return {
				...state,
				error: action.payload.error,
				data: {
					tutor: action.payload.data.tutor,
					tutors: null
				}
			};
		case TutorActionTypes.CLOCKOUT_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case TutorActionTypes.FETCH_ALL_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					tutors: action.payload.data.tutors
				}
			};
		case TutorActionTypes.FETCH_ALL_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case TutorActionTypes.UPDATE_SUCCESS:
			return {
				...state
			};
		case TutorActionTypes.UPDATE_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case TutorActionTypes.CLEAR_ERROR:
			return {
				...state,
				error: action.payload.error
			};
		default:
			return { ...state };
	}
};

export default TutorReducer;
