import * as React from 'react';
import styles from './styles.module.css';
import { TextFieldProps } from './props';

export const TextField: React.SFC<TextFieldProps> = (props) => {
	const { label, autoFocus, type, value, onTextChange } = props;
	return (
		<div>
			{label !== '' ? (
				<div>
					<label>{label}</label> <br />
				</div>
			) : null}
			<input autoFocus={autoFocus} type={type} value={value} onChange={onTextChange} />
		</div>
	);
};

TextField.defaultProps = {
	label: '',
	autoFocus: false
};
