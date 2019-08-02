import { Subject } from 'config';

export interface SubjectTableProps {
	data: Subject[];
	selected: Subject | null;
	selectAndUpdateSubject: (subject: Subject) => void;
}
