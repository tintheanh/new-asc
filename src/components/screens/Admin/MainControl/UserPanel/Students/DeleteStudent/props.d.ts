import { Student } from 'config';

export interface DeleteStudentProps {
	selected: Student | null;
	data: Student[];
	deleteStudent: (uid: string, students: Student[]) => void;
}
