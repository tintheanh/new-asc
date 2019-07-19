import * as React from 'react';
import { Tutor } from 'redux/store/tutor/types';
import { TutorSubjectReportStates } from './props';
import { TinySubject } from 'components/common';

const ipcRenderer = (window as any).ipcRenderer;

export class TutorSubjectReport extends React.Component<any, TutorSubjectReportStates> {
	constructor(props: any) {
		super(props);
		this.state = {
			data: []
		};
	}

	componentDidMount() {
		ipcRenderer.on('tutor-subject-report', (_: any, content: Tutor[]) => {
			this.setState({
				data: content
			});
		});
	}

	renderSubject = (data: { label: string; full: string }[]): JSX.Element[] => {
		return data.map((e: { label: string; full: string }, i: number) => (
			<TinySubject key={i} label={e.label} full={e.full} />
		));
	};

	render() {
		const { data } = this.state;
		if (data) {
			// console.log(data);
			return (
				<div>
					<h1>Report</h1>
					{data.map((e: Tutor, i: number) => (
						<div key={i}>
							<h3>{e.first_name} {e.last_name}</h3>
							{this.renderSubject(e.subjects)}
						</div>
					))}
				</div>
			);
		}
		return null;
	}
}
