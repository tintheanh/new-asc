import { Tutor } from 'redux/store/tutor/types';

export interface TutorsProps {
	fetchAllTutors: () => void;
	clear: () => void;
}
