import { Tutor } from 'redux/store/tutor/types';

export interface TutorFormProps {
	disable: boolean;
	selected: Tutor | null;
	toggleEdit: () => void;
	onTextChange: {
		updateBasicInfo: (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
	};

	toggleCancel: () => void;
	handleSubmit: (event: React.FormEvent) => void;
}
