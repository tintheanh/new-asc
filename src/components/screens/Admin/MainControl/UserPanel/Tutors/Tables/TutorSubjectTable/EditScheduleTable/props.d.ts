import { Tutor, Schedule, Time } from 'config';

export interface EditScheduleTableProps {
	data: Tutor[];
	selected: Tutor | null;
	selectAndUpdateTutor: any;
	updateTutor: (tutor: Tutor, tutors: Tutor[], scheduleOnly: boolean = false) => Promise<void>;
	close: () => void;
}

export interface EditScheduleTableStates {
	selectedTime: Time[];
	selectedHours: Schedule | null;
	timeIndexes: number[];
	toggleSelectShift: boolean;
	toggleSelectCtrl: boolean;
}
