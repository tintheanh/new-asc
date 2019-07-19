export interface ButtonProps {
	label: string;
	onClick: any;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
}
