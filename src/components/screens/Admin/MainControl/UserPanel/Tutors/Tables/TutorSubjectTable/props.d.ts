import { Tutor } from 'redux/store/tutor/types';

export interface TutorSubjectTableProps {
	selected: Tutor | null;
	data: Tutor[];
	toggleAdd: boolean;
	resetTutor: (uid: string, tutors: Tutor[]) => void;
}

export interface TutorSubjectTableStates {
	modalSubject: boolean;
}
