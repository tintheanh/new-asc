import { Tutor } from 'config';

export interface EditScheduleProps {
	data: Tutor[];
	selected: Tutor | null;
  toggleAdd: boolean;
  resetTutor: (uid: string, data: Tutors) => void;
}

export interface EditScheduleStates {
	modalSchedule: boolean;
}
