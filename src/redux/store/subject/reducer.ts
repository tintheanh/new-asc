import { SubjectActionTypes, SubjectState, ActionPayload } from './types';

const initialState = {
	data: {
		selectedSubject: null,
		subjects: [],
		toggleAdd: false
	},
	error: ''
};

const SubjectReducer = (state: SubjectState = initialState, action: ActionPayload): SubjectState => {
	switch (action.type) {
		case SubjectActionTypes.FETCH_ALL_SUBJECTS_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					subjects: action.payload.data.subjects
				}
			};
		case SubjectActionTypes.FETCH_ALL_SUBJECTS_FAILURE:
			return { ...state, error: action.payload.error };
		case SubjectActionTypes.SELECT_AND_UPDATE_SUBJECT:
			return {
				...state,
				data: {
					...state.data,
					selectedSubject: action.payload.data.selectedSubject
				}
			};
		case SubjectActionTypes.TOGGLE_ADD: {
			if (action.payload.data.toggleAdd) {
				return {
					...state,
					data: {
						...state.data,
						selectedSubject: action.payload.data.selectedSubject,
						toggleAdd: action.payload.data.toggleAdd
					}
				};
			}
			return {
				...state,
				data: {
					...state.data,
					selectedSubject: null,
					toggleAdd: action.payload.data.toggleAdd
				}
			};
		}
		case SubjectActionTypes.UPDATE_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					subjects: action.payload.data.subjects
				}
			};
		case SubjectActionTypes.UPDATE_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case SubjectActionTypes.ADD_SUCCESS:
			return {
				...state,
				data: { ...state.data, subjects: action.payload.data.subjects }
			};
		case SubjectActionTypes.ADD_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case SubjectActionTypes.DELETE_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					selectedSubject: action.payload.data.selectedSubject,
					subjects: action.payload.data.subjects
				}
			};
		case SubjectActionTypes.DELETE_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		default:
			return { ...state };
	}
};

export default SubjectReducer;
