import { Tutor, Subject } from 'redux/store/subject/types';

export interface EditSubjectTableProps {
	subjects: Subject[];
	selected: Tutor;
	data: Tutor[];
	close: () => void;
	fetchAllSubjects: () => void;
	selectAndUpdateTutor: (tutor: Tutor) => void;
	updateTutor: (tutor: Tutor, tutors: Tutor[]) => Promise<void>;
}

export interface EditSubjectTableStates {
	toggleSelectCtrl: boolean;
	toggleSelectShift: boolean;
	removedSubjects: Subject[];
	addedSubjects: Subject[];

	removedSubjectIndexes: number[];
	addedSubjectIndexes: number[];

	[stateKey: string]: any;
}
