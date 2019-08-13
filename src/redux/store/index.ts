import { combineReducers } from 'redux';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'
import TutorReducer from './tutor/reducer';
import NavigationReducer from './navigation/reducer';
import SubjectReducer from './subject/reducer';
import StudentReducer from './student/reducer';
import AppointmentReducer from './appointment/reducer';

// const tutorPersistConfig = {
// 	key: 'auth',
// 	storage,
// 	blacklist: [ 'error' ]
// };

const rootReducer = combineReducers({
	// tutor: persistReducer(tutorPersistConfig, TutorReducer),
	tutor: TutorReducer,
	navigation: NavigationReducer,
	subject: SubjectReducer,
	student: StudentReducer,
	appointment: AppointmentReducer
});

export default rootReducer;
