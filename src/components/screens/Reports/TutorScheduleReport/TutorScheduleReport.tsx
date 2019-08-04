import * as React from 'react';
import { Tutor } from 'redux/store/tutor/types';
import { TinySchedule } from 'components/common';
import { TutorScheduleReportStates } from './props';
import { workDays } from 'config';

const ipcRenderer = (window as any).ipcRenderer;

export class TutorScheduleReport extends React.Component<any, TutorScheduleReportStates> {
	constructor(props: any) {
		super(props);
		this.state = {
			data: []
		};
	}

	componentDidMount() {
		ipcRenderer.on('tutor-schedule-report', (_: any, content: Tutor[]) => {
			this.setState({
				data: content
			});
		});
	}

	renderSchedule = (data: Tutor): JSX.Element[] => {
		return data.work_schedule.map((sch: any, i: number) => {
			return <TinySchedule key={i} day={workDays[i]} data={sch} />;
		});
	};

	render() {
		const { data } = this.state;
		console.log(data);
		if (data) {
			return (
				<div>
					<h1>Report</h1>
					{data.map((e: Tutor, i: number) => (
						<div key={i}>
							<h3>
								{e.first_name} {e.last_name}
							</h3>
							{this.renderSchedule(e)}
						</div>
					))}
				</div>
			);
		}
		return null;
	}
}
