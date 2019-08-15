import * as React from 'react';
import { CheckboxProps } from './props';

export const Checkbox: React.SFC<CheckboxProps> = (props) => {
	const { checked, onChange, labelText, disabled, value } = props;
	return (
		<label>
			<input type="checkbox" disabled={disabled} checked={checked} onChange={onChange} value={value} />
			<span style={{ position: 'relative', bottom: 7, left: 4 }}>{labelText ? labelText : null}</span>
		</label>
	);
};

Checkbox.defaultProps = {
	value: '',
	disabled: false
};
