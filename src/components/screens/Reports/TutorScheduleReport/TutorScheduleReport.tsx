import * as React from 'react';
import { Tutor } from 'redux/store/tutor/types';
import { TinySchedule } from 'components/common';
import { TutorScheduleReportStates } from './props';
import { workDays } from 'config';
import logo from 'components/common/mission-logo.png';
import styles from './styles.module.css';

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

	renderPage = () => {
		return this.state.data.map((tutor: any, i: number) => {
			if (i === 0) {
				return (
					<section key={i} className="sheet padding-15mm" style={{ width: '100%', height: 800 }}>
						<div className={styles.header}>
							<div>
								<img src={logo} alt="" width="50" />
							</div>
							<div>
								<h2>Report</h2>
								<h3>Tutor Schedule</h3>
							</div>
							<div>
								<img src={logo} alt="" width="50" />
							</div>
						</div>
						<div>
							<h4 className={styles.tutorName}>{`${tutor.first_name} ${tutor.last_name}`}</h4>
							{tutor.work_schedule.map((day: any, j: number) => {
								if (workDays[j] === 'Saturday') {
									return (
										<div key={j}>
											<div className={styles.dayReport}>
												<h4>{workDays[j]}</h4>
												{day.map((shift: any, k: number) => {
													if (k % 2 === 0)
														return (
															<div key={k} className={styles.even}>
																<p>{`${shift.from.time} - ${shift.to.time}`}</p>
															</div>
														);
													return (
														<div key={k} className={styles.odd}>
															<p>{`${shift.from.time} - ${shift.to.time}`}</p>
														</div>
													);
												})}
											</div>
										</div>
									);
								}
								return (
									<div key={j}>
										<div className={styles.dayReport}>
											<h4>{workDays[j]}</h4>
											{day.map((shift: any, k: number) => {
												if (k % 2 === 0)
													return (
														<div key={k} className={styles.even}>
															<p>{`${shift.from.time} - ${shift.to.time}`}</p>
														</div>
													);
												return (
													<div key={k} className={styles.odd}>
														<p>{`${shift.from.time} - ${shift.to.time}`}</p>
													</div>
												);
											})}
										</div>
										<div className={styles.divider} />
									</div>
								);
							})}
						</div>
					</section>
				);
			}
			return (
				<section key={i} className="sheet padding-15mm" style={{ width: '100%', height: 800 }}>
					<div>
						<h4 className={styles.tutorName}>{`${tutor.first_name} ${tutor.last_name}`}</h4>
						{tutor.work_schedule.map((day: any, j: number) => {
							if (workDays[j] === 'Saturday') {
								return (
									<div key={j}>
										<div className={styles.dayReport}>
											<h4>{workDays[j]}</h4>
											{day.map((shift: any, k: number) => {
												if (k % 2 === 0)
													return (
														<div key={k} className={styles.even}>
															<p>{`${shift.from.time} - ${shift.to.time}`}</p>
														</div>
													);
												return (
													<div key={k} className={styles.odd}>
														<p>{`${shift.from.time} - ${shift.to.time}`}</p>
													</div>
												);
											})}
										</div>
									</div>
								);
							}
							return (
								<div key={j}>
									<div className={styles.dayReport}>
										<h4>{workDays[j]}</h4>
										{day.map((shift: any, k: number) => {
											if (k % 2 === 0)
												return (
													<div key={k} className={styles.even}>
														<p>{`${shift.from.time} - ${shift.to.time}`}</p>
													</div>
												);
											return (
												<div key={k} className={styles.odd}>
													<p>{`${shift.from.time} - ${shift.to.time}`}</p>
												</div>
											);
										})}
									</div>
									<div className={styles.divider} />
								</div>
							);
						})}
					</div>
				</section>
			);
		});
	};

	render() {
		const { data } = this.state;
		console.log(data);
		if (data) {
			return (
				<div className="A4" style={{ marginTop: 66 }}>
					{/* <h1>Report</h1>
					{data.map((e: Tutor, i: number) => (
						<div key={i}>
							<h3>
								{e.first_name} {e.last_name}
							</h3>
							{this.renderSchedule(e)}
						</div>
					))} */}
					{this.renderPage()}
				</div>
			);
		}
		return null;
	}
}
