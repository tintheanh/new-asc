import * as React from 'react';
import { Tutor } from 'redux/store/tutor/types';
import { TutorSubjectReportStates } from './props';
import { TinySubject } from 'components/common';
import { chunk } from 'utils/functions';
import styles from './styles.module.css';
import logo from 'components/common/mission-logo.png';

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

	renderPage = (data: any[]) => {
		return data.map((chunk: any, i: number) => {
			if (i === 0) {
				return (
					<section className="sheet padding-15mm" key={i} style={{ width: '100%', height: 800 }}>
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
						{chunk.map((tutor: any, j: number) => (
							<div key={j}>
								<h4 className={styles.tutorName}>{`${tutor.first_name} ${tutor.last_name}`}</h4>
								<div className={styles.reportColumns}>
									<span>Label</span>
									<span>Name</span>
								</div>
								{tutor.subjects.map((subject: any, k: number) => {
									if (k % 2 === 0) {
										return (
											<div className={`${styles.subject} ${styles.even}`} key={k}>
												<h5>{subject.label}</h5>
												<h5>{subject.full}</h5>
											</div>
										);
									}
									return (
										<div className={`${styles.subject} ${styles.odd}`} key={k}>
											<h5>{subject.label}</h5>
											<h5>{subject.full}</h5>
										</div>
									);
								})}
							</div>
						))}
					</section>
				);
			}
			return (
				<section className="sheet padding-15mm" key={i} style={{ width: '100%', height: 800 }}>
					{chunk.map((tutor: any, j: number) => (
						<div key={j}>
							<h4 className={styles.tutorName}>{`${tutor.first_name} ${tutor.last_name}`}</h4>
							<div className={styles.reportColumns}>
								<span>Label</span>
								<span>Name</span>
							</div>
							{tutor.subjects.map((subject: any, k: number) => {
								if (k % 2 === 0) {
									return (
										<div className={`${styles.subject} ${styles.even}`} key={k}>
											<h5>{subject.label}</h5>
											<h5>{subject.full}</h5>
										</div>
									);
								}
								return (
									<div className={`${styles.subject} ${styles.odd}`} key={k}>
										<h5>{subject.label}</h5>
										<h5>{subject.full}</h5>
									</div>
								);
							})}
						</div>
					))}
				</section>
			);
		});
	};

	processData = () => {
		const subjectWithIds = this.state.data.map((tutor: any, i: number) => {
			return tutor.subjects.map((subject: any) => ({
				uid: tutor.uid,
				subject
			}));
		});
		const flatted = subjectWithIds.flat();
		const chunked = chunk(flatted, 2);

		const finals: any[] = [];
		this.state.data.forEach((tutor: any) => {
			chunked.forEach((ch: any) => {
				const subjects: any[] = [];
				ch.forEach((sub: any) => {
					if (sub.uid === tutor.uid) {
						subjects.push(sub.subject);
					}
				});
				const finTutor = { ...tutor, subjects };
				finals.push([ finTutor ]);
			});
		});

		console.log(finals);
		return finals;
	};

	render() {
		const { data } = this.state;
		console.log(data);
		if (data) {
			return (
				<div className="A4" style={{ marginTop: 66 }}>
					{this.renderPage(this.processData())}
					{/* <div className="A4">
						<section className="sheet padding-15mm">
							<h1>Report</h1>
							{data.map((e: Tutor, i: number) => (
								<div key={i}>
									<h3>
										{e.first_name} {e.last_name}
									</h3>
									{this.renderSubject(e.subjects)}
								</div>
							))}
						</section>
					</div> */}
					{/* {this.test()} */}

					{/* <div className="A4">
						<section className="sheet padding-15mm">
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
							<div className={styles.reportSection}>
								<h4 className={styles.tutorName}>Anh Nguyen</h4>
								<div className={styles.reportColumns}>
									<span>Label</span>
									<span>Name</span>
								</div>
								<div className={`${styles.subject} ${styles.even}`}>
									<h5>CIS 43</h5>
									<h5>Java Programming</h5>
								</div>
							</div>
						</section>
					</div> */}
				</div>
			);
		}
		return null;
	}
}
