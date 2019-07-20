import { Schedule, Tutor } from '../redux/store/tutor/types';

import { Subject } from '../redux/store/subject/types';

export interface Time {
	time: string;
	order: number;
}

export type Schedule = Schedule;
export type Tutor = Tutor;
export type Subject = Subject;
