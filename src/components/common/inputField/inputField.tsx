import * as React from 'react';
import { InputFieldProps } from './props';

export const InputField: React.SFC<InputFieldProps> = (props) => {
	const { customClassName, label, autoFocus, type, value, onTextChange, disabled, placeholder } = props;
	return (
		<div>
			{label !== '' ? (
				<label>
					{label} <br />
				</label>
			) : null}
			<div className="form-group">
				<input
					style={label ? { marginTop: 12 } : {}}
					className={`form-control ${customClassName}`}
					autoFocus={autoFocus}
					placeholder={placeholder}
					type={type}
					value={value}
					onChange={onTextChange}
					disabled={disabled}
				/>
			</div>
		</div>
	);
};

InputField.defaultProps = {
	customClassName: '',
	placeholder: '',
	label: '',
	autoFocus: false,
	disabled: false
};
