import { SubjectActionTypes, SubjectState, ActionPayload } from './types';

const initialState = {
	subjects: [],
	error: ''
};

const SubjectReducer = (state: SubjectState = initialState, action: ActionPayload): SubjectState => {
	switch (action.type) {
		case SubjectActionTypes.FETCH_ALL_SUBJECTS_SUCCESS:
			return { ...state, subjects: action.payload.data };
		case SubjectActionTypes.FETCH_ALL_SUBJECTS_FAILURE:
			return { ...state, error: action.payload.error };
		default:
			return { ...state };
	}
};

export default SubjectReducer;
