import * as React from 'react';
import { ButtonProps } from './props';

export const Button: React.SFC<ButtonProps> = (props) => {
	const { label, onClick, type, disabled } = props;
	return (
		<button type={type} disabled={disabled} onClick={onClick}>
			{label}
		</button>
	);
};

Button.defaultProps = {
	type: 'button',
	disabled: false
};
