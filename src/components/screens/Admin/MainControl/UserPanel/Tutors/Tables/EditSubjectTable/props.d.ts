import { Subject } from 'redux/store/subject/types';

export interface EditSubjectTableProps {
	subjects: Subject[];
	fetchAllSubjects: () => void;
	tutorSubjects: Subject[] | null;

	onUpdate: (subjects: Subject[], type: 'add' | 'remove') => void;
}

export interface EditSubjectTableStates {
	toggleSelectMultiple: boolean;
	toggleSelectShift: boolean;
	subjects: Subject[];
	removedSubjects: Subject[];
	addedSubjects: Subject[];

	removedSubjectIndexes: number[];
	addedSubjectIndexes: number[];

	[stateKey: string]: any;
}
