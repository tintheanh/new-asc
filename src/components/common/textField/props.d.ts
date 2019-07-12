export interface TextFieldProps {
	label?: string;
	value: string;
	type: string;
	autoFocus?: boolean;
	onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
