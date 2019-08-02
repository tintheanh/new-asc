import { Schedule, Tutor } from '../redux/store/tutor/types';
import { Subject } from '../redux/store/subject/types';
import { Student } from '../redux/store/student/types';

export interface Time {
	time: string;
	order: number;
}

export type Schedule = Schedule;
export type Tutor = Tutor;
export type Subject = Subject;
export type Student = Student;
