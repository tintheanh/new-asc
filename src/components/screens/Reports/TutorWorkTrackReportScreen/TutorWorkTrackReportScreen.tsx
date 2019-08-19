import * as React from 'react';
import { TutorWorkTrackReportState } from './props';
import { Tutor } from 'redux/store/tutor/types';
import { Track } from 'components/common';
import { chunk, getDateFromUnix, getTimeFromUnix, timeDiff, secondsToHms } from 'utils/functions';
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

class TutorWorkTrackReportScreen extends React.Component<any, any> {
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

	processData = () => {
		const processed = this.state.data.tutors.map((tutor: any) => {
			const tracks: TrackType[] = [];
			if (tutor.work_track) {
				Object.keys(tutor.work_track).forEach((date) => {
					let track: TrackType = {
						date: 0,
						logs: []
					};

					// Only show work track within chosen range
					if (this.state.data.range.from <= Number(date) && Number(date) <= this.state.data.range.to) {
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
			}
			return { ...tutor, work_track: tracks };
		});
		const breakTracks = processed.map((tutor: any) => {
			return tutor.work_track.map((track: any) => {
				return track.logs.map((log: any) => {
					return {
						uid: tutor.uid,
						date: track.date,
						log
					};
				});
			});
		});

		const flatted = breakTracks.flat(Infinity);
		const chunked = chunk(flatted, 14);

		const results = chunked.map((ch: any) => {
			const group_to_values = ch.reduce((obj: any, item: any) => {
				obj[item.uid] = obj[item.uid] || [];
				obj[item.uid].push({ date: item.date, log: item.log });
				return obj;
			}, {});

			const groups = Object.keys(group_to_values).map((key: any) => {
				const tutor = processed.filter((tt: any) => tt.uid === key)[0];
				return { ...tutor, work_track: group_to_values[key] };
			});
			return groups;
		});
		const finals = results.map((ch: any) => {
			return ch.map((tutor: any) => {
				const group_to_values = tutor.work_track.reduce((obj: any, item: any) => {
					obj[item.date] = obj[item.date] || [];
					obj[item.date].push(item.log);
					return obj;
				}, {});

				const groups = Object.keys(group_to_values).map((key: any) => {
					return { date: Number(key), logs: group_to_values[key] };
				});
				const groupWithTotals = groups.map((group: any) => {
					const total = group.logs.reduce((acc: any, cur: any) => {
						const diff = cur.out_time - cur.in_time;
						return acc + diff;
					}, 0);
					return { ...group, total };
				});
				return { ...tutor, work_track: groupWithTotals };
			});
		});
		return finals;
	};

	renderPage = (data: any[]) => {
		if (!data.length) {
			return (
				<div>
					<section className={`sheet padding-15mm ${styles.page}`}>
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
					</section>
					<p className={styles.pageNum}>page: 1</p>
				</div>
			);
		}
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
									<h3>Tutor Work Track</h3>
								</div>
								<div>
									<img src={logo} alt="" width="50" />
								</div>
							</div>
						) : null}
						{chunk.map((tutor: any, j: number) => {
							return (
								<div key={j}>
									<h4 className={styles.tutorName}>{`${tutor.first_name} ${tutor.last_name}`}</h4>
									{tutor.work_track.map((track: any, k: number) => {
										return (
											<div key={k} className={styles.dayReport}>
												<h4>{getDateFromUnix(track.date)}</h4>
												{track.logs.map((log: any, g: number) => {
													return (
														<div key={g} className={g % 2 === 0 ? styles.even : styles.odd}>
															<p>
																{getTimeFromUnix(log.in_time)} -{' '}
																{getTimeFromUnix(log.out_time)}:{' '}
															</p>
															<p>{timeDiff(log.in_time, log.out_time)}</p>
														</div>
													);
												})}
												<div className={styles.total}>
													<strong>Total:</strong> <strong>{secondsToHms(track.total)}</strong>
												</div>
											</div>
										);
									})}
								</div>
							);
						})}
					</section>

					<p className={styles.pageNum}>{`page: ${i + 1}`}</p>
				</div>
			);
		});
	};

	render() {
		const { data } = this.state;
		if (data) {
			// console.log(data);
			// this.processData();
			console.log(this.processData());
			return (
				<div className="A4" style={{ marginTop: 66 }}>
					{this.renderPage(this.processData())}
				</div>
			);
		}
		return null;
	}
}

export default TutorWorkTrackReportScreen;
