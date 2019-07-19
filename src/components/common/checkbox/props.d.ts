export interface CheckboxProps {
	checked: boolean;
	labelText?: string;
	disabled?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
