import { Tutor } from 'config';

export interface DeleteTutorProps {
	selected: Tutor | null;
	data: Tutor[];
	deleteTutor: (uid: string, tutors: Tutors) => void;
}
