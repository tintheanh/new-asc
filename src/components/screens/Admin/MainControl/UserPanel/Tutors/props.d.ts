import { Tutor } from 'redux/store/tutor/types';

export interface TutorsProps {
	selected: Tutor | null;
	data: Tutor[];
	fetchAllTutors: () => void;
	selectAndUpdateTutor: (tutor: Tutor) => void;
	updateTutor: (update: Tutor) => Promise<void>;
	resetTutor: (uid: string, data: Tutor[]) => void;
	clear: () => void;
}
