import { Student } from 'config';

export interface StudentFormProps {
	selected: Student | null;
	data: Student[];
	toggleAdd: boolean;
	resetStudent: (uid: string, data: Student[]) => void;
	updateStudent: (student: Student, students: Student[]) => Promise<void>;
	selectAndUpdateStudent: (student: Student) => void;
	toggleAddStudent: (on: boolean) => void;
	addStudent: (student: Student, students: Student[]) => Promise<void>;
}

export interface StudentFormStates {
	edit: boolean;
}
