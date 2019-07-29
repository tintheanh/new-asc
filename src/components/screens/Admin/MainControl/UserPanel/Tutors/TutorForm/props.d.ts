import { Tutor } from 'redux/store/tutor/types';

export interface TutorFormProps {
	selected: Tutor | null;
	toggleAdd: boolean;
	data: Tutor[];
	selectAndUpdateTutor: (tutor: Tutor) => void;
	resetTutor: (uid: string, tutors: Tutor[]) => void;
	updateTutor: (tutor: Tutor, tutors: Tutor[]) => Promise<void>;
	toggleAddTutor: (on: boolean) => void;
	addTutor: (tutor: Tutor, tutors: Tutor[]) => Promise<void>;
}

export interface TutorFormStates {
	edit: boolean;
}
