import * as React from 'react';
import { CheckboxProps } from './props';

export const Checkbox: React.SFC<CheckboxProps> = (props) => {
	const { checked, onChange, labelText, disabled } = props;
	return (
		<div>
			<input type="checkbox" disabled={disabled} checked={checked} onChange={onChange} />
			{labelText ? <span>{labelText}</span> : null}
		</div>
	);
};

Checkbox.defaultProps = {
	disabled: false
};
