import { Tutor, Schedule, Time } from 'config';

export interface EditScheduleTableProps {
	tutor: Tutor | null;
}

export interface EditScheduleTableStates {
	tutor: Tutor | null;
	selectedTime: Time[];
	selectedHours: Schedule | null;
	timeIndexes: number[];
	toggleSelectShift: boolean;
	toggleSelectCtrl: boolean;
}
