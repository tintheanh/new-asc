export interface ButtonProps {
	customClassName?: string;
	label: string;
	onClick?: any;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	loading?: boolean;
}
