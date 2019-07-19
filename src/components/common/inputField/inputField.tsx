import * as React from 'react';
import styles from './styles.module.css';
import { InputFieldProps } from './props';

export const InputField: React.SFC<InputFieldProps> = (props) => {
	const { label, autoFocus, type, value, onTextChange, disabled } = props;
	return (
		<div>
			{label !== '' ? (
				<div>
					<label>{label}</label> <br />
				</div>
			) : null}
			<input autoFocus={autoFocus} type={type} value={value} onChange={onTextChange} disabled={disabled} />
		</div>
	);
};

InputField.defaultProps = {
	label: '',
	autoFocus: false,
	disabled: false
};
