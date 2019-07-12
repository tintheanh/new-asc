import * as React from 'react';
import { tinySubjectProps } from './props';

export const TinySubject: React.SFC<tinySubjectProps> = (props) => {
	const { label, full } = props;
	return (
		<div>
			<p>{label}</p>
			<p>{full}</p>
		</div>
	);
};
