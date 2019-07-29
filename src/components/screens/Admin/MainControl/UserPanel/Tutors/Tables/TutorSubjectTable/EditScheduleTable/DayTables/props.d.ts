import { Schedule } from 'config';

export interface DayTablesProps {
	schedules: Schedule[][];
	isPickingTime: boolean;
	toggleSelectCtrl: boolean;
	toggleSelectShift: boolean;

	onAddHours: (dayOfWeek: number) => () => void;
	onDeleteSchedules: (day: number, schedules: Schedule[]) => void;
}

export interface DayTablesStates {
	selectedSchedules: Schedule[];
	scheduleIndexes: number[];
	currentDay: number;
}
