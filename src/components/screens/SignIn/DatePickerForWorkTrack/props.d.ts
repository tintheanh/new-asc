import { Tutor } from 'redux/store/tutor/types';
// Application-level states
export interface DatePickerProps {
	data: Tutor;
	error: string;
}

// Local states
export interface DatePickerStates {
	from: Date;
	to: Date;
	[stateKey: string]: Date;
}
