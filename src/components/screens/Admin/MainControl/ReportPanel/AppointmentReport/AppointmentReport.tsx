import * as React from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'components/common';
import AppointmentReportOptionNavigation from './AppointmentReportOptionNavigation/AppointmentReportOptionNavigation';
import AppointmentReportMainControl from './AppointmentReportMainControl';
import back from 'components/common/back.png';
import styles from './styles.module.css';

class AppointmentReport extends React.Component<any, any> {
	render() {
		return (
			<div>
				<Header title="Appointment Report" />
				<Link className={styles.backBtn} to="/admin">
					<img src={back} alt="" width="35" />
				</Link>
				<div className={styles.container}>
					<AppointmentReportOptionNavigation />
					<AppointmentReportMainControl />
				</div>
			</div>
		);
	}
}

export default AppointmentReport;
