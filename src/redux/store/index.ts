import { combineReducers } from 'redux';

import TutorReducer from './tutor/reducer';
import NavigationReducer from './navigation/reducer';
import SubjectReducer from './subject/reducer';

const rootReducer = combineReducers({
	tutor: TutorReducer,
	navigation: NavigationReducer,
	subject: SubjectReducer
});

export default rootReducer;
