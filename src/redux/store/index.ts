import { combineReducers } from 'redux';

import TutorReducer from './tutor/reducer';

const rootReducer = combineReducers({
	tutor: TutorReducer
});

export default rootReducer;
