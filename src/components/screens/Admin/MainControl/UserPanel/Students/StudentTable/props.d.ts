import { Student } from 'config';

export interface StudentTableProps {
	selected: Student | null;
	data: Student[];
	selectAndUpdateStudent: (student: Student) => void;
}

export interface StudentTableStates {
  hideInactive: boolean;
}
