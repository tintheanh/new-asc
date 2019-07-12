import * as React from 'react';
import { TrackProps } from './props';
import { getDateFromUnix, getTimeFromUnix, timeDiff } from 'utils/functions';

export const Track: React.SFC<TrackProps> = (props) => {
	const { date, logs } = props;
	return (
		<div>
			<p>{getDateFromUnix(date)}</p>
			<ul>
				{logs.map((e, i) => (
					<li key={i}>
						{getTimeFromUnix(e.in_time)} - {getTimeFromUnix(e.out_time)}: {timeDiff(e.in_time, e.out_time)}
					</li>
				))}
			</ul>
		</div>
	);
};
