import * as React from 'react';
import { tinyScheduleProps } from './props';

export const TinySchedule: React.SFC<tinyScheduleProps> = (props) => {
	return (
		<div>
			<h3>{props.day}</h3>
			<ul>
				{props.data.map((e, i) => (
					<li key={i}>
						{e!.from.time} - {e!.to.time}
					</li>
				))}
			</ul>
		</div>
	);
};
