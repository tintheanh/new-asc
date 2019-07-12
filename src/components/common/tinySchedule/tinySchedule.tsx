import * as React from 'react';
import { tinyScheduleProps } from './props';

export const TinySchedule: React.SFC<tinyScheduleProps> = (props) => {
	return (
		<div>
			<h3>{props.day}</h3>
			<ul>
				{props.segments ? (
					props.segments.map((e, i) => (
						<li key={i}>
							{e!.from} - {e!.to}
						</li>
					))
				) : null}
			</ul>
		</div>
	);
};

TinySchedule.defaultProps = {
	segments: []
};
