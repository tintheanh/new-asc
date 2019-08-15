export interface InputFieldProps {
	customClassName?: string;
	label?: string;
	value: string;
	type: string;
	placeholder?: string;
	autoFocus?: boolean;
	disabled?: boolean;
	onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
