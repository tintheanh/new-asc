import { Subject } from 'config';

export interface DeleteSubjectProps {
	selected: Subject | null;
	data: Subject[];
	deleteSubject: (id: string, subjects: Subject[]) => void;
}
