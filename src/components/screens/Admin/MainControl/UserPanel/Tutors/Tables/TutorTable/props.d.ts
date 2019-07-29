import { Tutor } from 'redux/store/tutor/types';

export interface TutorTableProps {
	data: Tutor[];
	selectAndUpdateTutor: (tutor: Tutor) => void;
	selected: Tutor | null;
}

export interface TutorTableStates {
	hideInactive: boolean;
}
