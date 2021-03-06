import * as React from 'react';
import { chunk, arraySort } from 'utils/functions';
import styles from './styles.module.css';
import logo from 'components/common/mission-logo.png';

const ipcRenderer = (window as any).ipcRenderer;

class AppointmentByTutorReportScreen extends React.Component<any, any> {
	state = {
		data: {
			appointments: [],
			dateFilter: []
		}
	};
	componentDidMount() {
		ipcRenderer.on('appointment-by-tutor-report', (_: any, content: any) => {
			this.setState({
				data: content
			});
		});
	}

	processData = () => {
		const chunked = chunk(this.state.data.appointments, 15);

		const results = chunked.map((ch: any) => {
			const group_to_values = ch.reduce((obj: any, item: any) => {
				obj[item.tutor.uid] = obj[item.tutor.uid] || [];
				obj[item.tutor.uid].push(item);
				return obj;
			}, {});

			const groups = Object.keys(group_to_values).map((key: any) => {
				return { ...group_to_values[key][0].tutor, appointments: arraySort(group_to_values[key], 'apptDate') };
			});
			return arraySort(groups, 'first_name');
		});
		return results;
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
								<h3>Appointment</h3>
								<p>
									{this.state.data.dateFilter[0] ? (
										new Date(this.state.data.dateFilter[0] * 1000).toLocaleDateString('en-US')
									) : (
										''
									)}{' '}
									-{' '}
									{this.state.data.dateFilter[1] ? (
										new Date(this.state.data.dateFilter[1] * 1000).toLocaleDateString('en-US')
									) : (
										''
									)}
								</p>
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
		return data.map((ch: any, i: number) => (
			<div key={i}>
				<section className={`sheet padding-15mm ${styles.page}`}>
					{i === 0 ? (
						<div className={styles.header}>
							<div>
								<img src={logo} alt="" width="50" />
							</div>
							<div>
								<h2>Report</h2>
								<h3>Appointment</h3>
								<p>
									{this.state.data.dateFilter[0] ? (
										new Date(this.state.data.dateFilter[0] * 1000).toLocaleDateString('en-US')
									) : (
										''
									)}{' '}
									-{' '}
									{this.state.data.dateFilter[1] ? (
										new Date(this.state.data.dateFilter[1] * 1000).toLocaleDateString('en-US')
									) : (
										''
									)}
								</p>
							</div>
							<div>
								<img src={logo} alt="" width="50" />
							</div>
						</div>
					) : null}
					{ch.map((tutor: any, j: number) => (
						<div key={j}>
							<h4 className={styles.tutorName}>{`${tutor.first_name} ${tutor.last_name}`}</h4>
							<div className={styles.apptContainer}>
								<span>
									<span className={styles.label}>Student</span>
									{tutor.appointments.map((appt: any, k: number) => (
										<div key={k} className={k % 2 === 0 ? styles.even : styles.odd}>
											<p>{`${appt.student.first_name} ${appt.student.last_name}`}</p>
										</div>
									))}
								</span>
								<span>
									<span className={styles.label}>Date</span>
									{tutor.appointments.map((appt: any, k: number) => (
										<div key={k} className={k % 2 === 0 ? styles.even : styles.odd}>
											<p>{new Date(appt.apptDate * 1000).toLocaleDateString('en-US')}</p>
										</div>
									))}
								</span>
								<span>
									<span className={styles.label}>Start</span>
									{tutor.appointments.map((appt: any, k: number) => (
										<div key={k} className={k % 2 === 0 ? styles.even : styles.odd}>
											<p>{appt.time.from}</p>
										</div>
									))}
								</span>
								<span>
									<span className={styles.label}>End</span>
									{tutor.appointments.map((appt: any, k: number) => (
										<div key={k} className={k % 2 === 0 ? styles.even : styles.odd}>
											<p>{appt.time.to}</p>
										</div>
									))}
								</span>
								<span>
									<span className={styles.label}>Subject</span>
									{tutor.appointments.map((appt: any, k: number) => (
										<div key={k} className={k % 2 === 0 ? styles.even : styles.odd}>
											<p>{`${appt.subject.label}`}</p>
										</div>
									))}
								</span>
							</div>
						</div>
					))}
				</section>
				<p className={styles.pageNum}>{`page: ${i + 1}`}</p>
			</div>
		));
	};

	render() {
		console.log(this.state.data);
		if (this.state.data) {
			if (this.state.data.appointments.length) {
				return (
					<div className="A4" style={{ marginTop: 66 }}>
						{this.renderPage(this.processData())}
					</div>
				);
			}
			return (
				<div className="A4" style={{ marginTop: 66 }}>
					<section className={`sheet padding-15mm ${styles.page}`}>
						<div className={styles.header}>
							<div>
								<img src={logo} alt="" width="50" />
							</div>
							<div>
								<h2>Report</h2>
								<h3>Appointment</h3>
								<p>
									{this.state.data.dateFilter[0] ? (
										new Date(this.state.data.dateFilter[0] * 1000).toLocaleDateString('en-US')
									) : (
										''
									)}{' '}
									-{' '}
									{this.state.data.dateFilter[1] ? (
										new Date(this.state.data.dateFilter[1] * 1000).toLocaleDateString('en-US')
									) : (
										''
									)}
								</p>
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
		return null;
	}
}

export default AppointmentByTutorReportScreen;
