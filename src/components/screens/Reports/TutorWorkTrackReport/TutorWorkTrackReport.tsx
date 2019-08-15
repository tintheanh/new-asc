import * as React from 'react';
import { TutorWorkTrackReportState } from './props';
import { Tutor } from 'redux/store/tutor/types';
import { Track } from 'components/common';
import { getDateFromUnix, getTimeFromUnix, timeDiff } from 'utils/functions';
import logo from 'components/common/mission-logo.png';
import styles from './styles.module.css';

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

	processData = (range: any, tutor: any) => {
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
		return tracks;
	};

	renderPage = () => {
		return this.state.data.tutors.map((tutor: any, i: number) => {
			const data = this.processData(this.state.data.range, tutor);
			if (i === 0) {
				return (
					<section key={i} className="sheet padding-15mm" style={{ width: '100%', height: 800 }}>
						<div className={styles.header}>
							<div>
								<img src={logo} alt="" width="50" />
							</div>
							<div>
								<h2>Report</h2>
								<h3>Tutor Work Track</h3>
							</div>
							<div>
								<img src={logo} alt="" width="50" />
							</div>
						</div>
						<div>
							<h4 className={styles.tutorName}>{`${tutor.first_name} ${tutor.last_name}`}</h4>
							{data.map((track: any, j: number) => {
								if (j === data.length - 1) {
									return (
										<div key={j}>
											<div className={styles.dayReport}>
												<h4>{getDateFromUnix(track.date)}</h4>
												{track.logs.map((log: any, k: number) => {
													if (k % 2 === 0)
														return (
															<div key={k} className={styles.even}>
																<p>
																	{getTimeFromUnix(log.in_time)} -{' '}
																	{getTimeFromUnix(log.out_time)}:{' '}
																	{timeDiff(log.in_time, log.out_time)}
																</p>
															</div>
														);
													return (
														<div key={k} className={styles.odd}>
															<p>
																{getTimeFromUnix(log.in_time)} -{' '}
																{getTimeFromUnix(log.out_time)}:{' '}
																{timeDiff(log.in_time, log.out_time)}
															</p>
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
											<h4>{getDateFromUnix(track.date)}</h4>
											{track.logs.map((log: any, k: number) => {
												if (k % 2 === 0)
													return (
														<div key={k} className={styles.even}>
															<p>
																{getTimeFromUnix(log.in_time)} -{' '}
																{getTimeFromUnix(log.out_time)}:{' '}
																{timeDiff(log.in_time, log.out_time)}
															</p>
														</div>
													);
												return (
													<div key={k} className={styles.odd}>
														<p>
															{getTimeFromUnix(log.in_time)} -{' '}
															{getTimeFromUnix(log.out_time)}:{' '}
															{timeDiff(log.in_time, log.out_time)}
														</p>
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
						{data.map((track: any, j: number) => {
							if (j === data.length - 1) {
								return (
									<div key={j}>
										<div className={styles.dayReport}>
											<h4>{getDateFromUnix(track.date)}</h4>
											{track.logs.map((log: any, k: number) => {
												if (k % 2 === 0)
													return (
														<div key={k} className={styles.even}>
															<p>
																{getTimeFromUnix(log.in_time)} -{' '}
																{getTimeFromUnix(log.out_time)}:{' '}
																{timeDiff(log.in_time, log.out_time)}
															</p>
														</div>
													);
												return (
													<div key={k} className={styles.odd}>
														<p>
															{getTimeFromUnix(log.in_time)} -{' '}
															{getTimeFromUnix(log.out_time)}:{' '}
															{timeDiff(log.in_time, log.out_time)}
														</p>
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
										<h4>{getDateFromUnix(track.date)}</h4>
										{track.logs.map((log: any, k: number) => {
											if (k % 2 === 0)
												return (
													<div key={k} className={styles.even}>
														<p>
															{getTimeFromUnix(log.in_time)} -{' '}
															{getTimeFromUnix(log.out_time)}:{' '}
															{timeDiff(log.in_time, log.out_time)}
														</p>
													</div>
												);
											return (
												<div key={k} className={styles.odd}>
													<p>
														{getTimeFromUnix(log.in_time)} - {getTimeFromUnix(log.out_time)}:{' '}
														{timeDiff(log.in_time, log.out_time)}
													</p>
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
		if (data) {
			// console.log(data);
			return (
				<div className="A4" style={{ marginTop: 66 }}>
					{this.renderPage()}
				</div>
			);
		}
		return null;
	}
}
