import * as React from 'react';
import { Tutor } from 'redux/store/tutor/types';
import { TutorSubjectReportStates } from './props';
import { TinySubject } from 'components/common';
import { processDataForReportPage } from 'utils/functions';
import styles from './styles.module.css';
import logo from 'components/common/mission-logo.png';

const ipcRenderer = (window as any).ipcRenderer;

class TutorSubjectReport extends React.Component<any, TutorSubjectReportStates> {
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

	renderPage = (data: any[]) => {
		return data.map((chunk: any, i: number) => {
			return (
				<div key={i}>
					<section className={`sheet padding-15mm ${styles.page}`}>
						{i === 0 ? (
							<div className={styles.header}>
								<div>
									<img src={logo} alt="" width="50" />
								</div>
								<div>
									<h2>Report</h2>
									<h3>Tutor Subjects</h3>
								</div>
								<div>
									<img src={logo} alt="" width="50" />
								</div>
							</div>
						) : null}

						{chunk.map((tutor: any, j: number) => (
							<div key={j}>
								<h4 className={styles.tutorName}>{`${tutor.first_name} ${tutor.last_name}`}</h4>
								<div className={styles.reportColumns}>
									<h4>Label</h4>
									<h4>Name</h4>
								</div>
								{tutor.subjects.map((subject: any, k: number) => {
									if (k % 2 === 0) {
										return (
											<div className={`${styles.subject} ${styles.even}`} key={k}>
												<p>{subject.label}</p>
												<p>{subject.full}</p>
											</div>
										);
									}
									return (
										<div className={`${styles.subject} ${styles.odd}`} key={k}>
											<p>{subject.label}</p>
											<p>{subject.full}</p>
										</div>
									);
								})}
							</div>
						))}
					</section>
					<p className={styles.pageNum}>{`page: ${i + 1}`}</p>
				</div>
			);
		});
	};

	processData = () => {
		const results = processDataForReportPage(this.state.data, 'subject', 'subjects', 18);
		return results;
	};

	render() {
		const { data } = this.state;

		if (data.length) {
			return (
				<div className="A4" style={{ marginTop: 66 }}>
					{this.renderPage(this.processData())}
				</div>
			);
		}
		return null;
	}
}

export default TutorSubjectReport;
