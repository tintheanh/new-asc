import { Tutor } from 'redux/store/tutor/types';

export interface TutorsProps {
	data: Tutor[];
	fetchAllTutors: () => void;
	updateTutor: (update: Tutor) => Promise<void>;
}

export interface TutorsStates {
	tutorIndex: number;
	selected: Tutor | null;
	hideInactive: boolean;
	edit: boolean;
	modalSubject: boolean;
	modalSchedule: boolean;

	[stateKey: string]: number | Tutor | boolean | null;
}
