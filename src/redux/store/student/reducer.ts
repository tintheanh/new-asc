import { StudentActionTypes, StudentState, ActionPayload } from './types';

const initialState = {
	data: {
		student: null,
		students: [],
		selectedStudent: null,
		toggleAdd: false
	},
	error: ''
};

const StudentReducer = (state: StudentState = initialState, action: ActionPayload): StudentState => {
	switch (action.type) {
		case StudentActionTypes.REGISTER_SUCCESS:
			return {
				...state
			};
		case StudentActionTypes.REGISTER_FAILTURE:
			return {
				...state,
				error: action.payload.error
			};
		case StudentActionTypes.FETCH_ALL_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					students: action.payload.data.students
				}
			};
		case StudentActionTypes.FETCH_ALL_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case StudentActionTypes.SELECT_AND_UPDATE_STUDENT:
			return {
				...state,
				data: {
					...state.data,
					selectedStudent: action.payload.data.selectedStudent
				}
			};
		case StudentActionTypes.UPDATE_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					students: action.payload.data.students
				}
			};
		case StudentActionTypes.UPDATE_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case StudentActionTypes.TOGGLE_ADD: {
			if (action.payload.data.toggleAdd) {
				return {
					...state,
					data: {
						...state.data,
						selectedStudent: action.payload.data.selectedStudent,
						toggleAdd: action.payload.data.toggleAdd
					}
				};
			}
			return {
				...state,
				data: {
					...state.data,
					selectedStudent: null,
					toggleAdd: action.payload.data.toggleAdd
				}
			};
		}
		case StudentActionTypes.ADD_SUCCESS:
			return {
				...state,
				data: { ...state.data, students: action.payload.data.students }
			};
		case StudentActionTypes.ADD_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case StudentActionTypes.CLEAR:
			return {
				...state,
				data: {
					...state.data,
					selectedStudent: action.payload.data.selectedStudent
				},
				error: action.payload.error
			};
		case StudentActionTypes.DELETE_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					selectedStudent: action.payload.data.student,
					students: action.payload.data.students
				}
			};
		case StudentActionTypes.DELETE_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		default:
			return { ...state };
	}
};

export default StudentReducer;
