import { Tutor } from 'redux/store/tutor/types';

export interface TutorTableProps {
	tutors: Tutor[];
	selectTutor: (rowInfo: any) => void;
	selected: Tutor | null;
}
