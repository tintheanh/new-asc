import { History } from 'history';
import { Tutor } from 'redux/store/tutor/types';

export interface SignInProps {
	// Application-level states
	loginAndFetchTutor: (tutorID: string) => Promise;
	tutorClockIn: (tutor: Tutor) => void;
	tutorClockOut: (uid: string, inTime: number) => void;
	logoutAndClearTutor: () => void;
	clear: () => void;
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
	[stateKey: string]: boolean | string;
	tutorID: string;
}
