import { History } from 'history';
import { Tutor } from 'redux/store/tutor/types';

export interface SignInProps {
	// Application-level states
	loginAndFetchTutor: (tutorID: string) => Promise;
	tutorClockIn: (uid: string) => void;
	tutorClockOut: (uid: string, inTime: number) => void;
	logoutAndClearTutor: () => void;
	data: Tutor;
	error?: string;

	// history prop
	history: History;
}

export interface SignInStates {
	// Local states
	time: string;
	mainModalShow: boolean;
	datePickerModalShow: boolean;
	tutorID: string;
}
