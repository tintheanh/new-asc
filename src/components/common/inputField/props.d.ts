export interface InputFieldProps {
	className?: string;
	label?: string;
	value: string;
	type: string;
	autoFocus?: boolean;
	disabled?: boolean;
	onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
