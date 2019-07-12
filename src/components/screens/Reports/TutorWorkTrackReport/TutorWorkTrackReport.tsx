import * as React from 'react';
import { TutorWorkTrackReportState } from './props';
import { Tutor } from 'redux/store/tutor/types';
import { Track } from 'components/common';

const ipcRenderer = (window as any).ipcRenderer;

interface DataRecieve {
	range: {
		from: number;
		to: number;
	};
	tutors: Tutor[];
}

interface TrackType {
	date: number;
	logs: {
		in_time: number;
		out_time: number;
	}[];
}

export class TutorWorkTrackReport extends React.Component<any, TutorWorkTrackReportState> {
	constructor(props: any) {
		super(props);
		this.state = { data: null };
	}

	componentDidMount() {
		ipcRenderer.on('tutor-work-report', (_: any, content: DataRecieve) => {
			this.setState({
				data: content
			});
		});
	}

	renderWorkTrack = (range: { from: number; to: number }, tutor: Tutor): JSX.Element[] => {
		const tracks: TrackType[] = [];
		Object.keys(tutor.work_track).forEach((date) => {
			let track: TrackType = {
				date: 0,
				logs: []
			};
			
			// Only show work track within chosen range
			if (range.from <= Number(date) && Number(date) <= range.to) {
				track.date = Number(date);
				const logs: { in_time: number; out_time: number }[] = [];
				Object.keys(tutor.work_track[date]).forEach((time) => {
					const log = {
						in_time: tutor.work_track[date][time].in,
						out_time: tutor.work_track[date][time].out
					};
					logs.push(log);
				});
				track.logs = logs;
				tracks.push(track);
			}
		});

		// console.log(tracks);

		return tracks.map((e: TrackType, i: number) => <Track key={i} date={e.date} logs={e.logs} />);
	};

	render() {
		const { data } = this.state;
		if (data) {
			// console.log(data);
			return (
				<div>
					<h1>Report</h1>
					{data.tutors.map((e: Tutor, i: number) => (
						<div key={i}>
							<h3>{e.name}</h3>
							{this.renderWorkTrack(data.range, e)}
						</div>
					))}
				</div>
			);
		}
		return null;
	}
}
