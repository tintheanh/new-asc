import { combineReducers } from 'redux';

import TutorReducer from './tutor/reducer';
import NavigationReducer from './navigation/reducer';
import SubjectReducer from './subject/reducer';
import StudentReducer from './student/reducer';

const rootReducer = combineReducers({
	tutor: TutorReducer,
	navigation: NavigationReducer,
	subject: SubjectReducer,
	student: StudentReducer
});

export default rootReducer;
