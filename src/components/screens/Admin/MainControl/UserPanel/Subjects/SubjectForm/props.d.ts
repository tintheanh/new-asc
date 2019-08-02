import { Subject } from 'config';

export interface SubjectFormProps {
	data: Subject[];
	selected: Subject | null;
	toggleAdd: boolean;
	selectAndUpdateSubject: (subject: Subject) => void;
	toggleAddSubject: (on: boolean) => void;
	updateSubject: (subject: Subject, subjects: Subject[]) => Promise<void>;
	addSubject: (subject: Subject, subjects: Subject[]) => Promise<void>;
	resetSubject: (id: string, subjects: Subject[]) => void;
}

export interface SubjectFormStates {
	edit: boolean;
}
