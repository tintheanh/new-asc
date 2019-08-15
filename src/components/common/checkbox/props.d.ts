export interface CheckboxProps {
	value?: any;
	checked: boolean;
	labelText?: string;
	disabled?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
