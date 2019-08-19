import * as React from 'react';
import ReportAppointmentTable from '../../ReportAppointmentTable/ReportAppointmentTable';
import styles from './styles.module.css';

class AppointmentByTutorReport extends React.Component<any, any> {
	render() {
		return (
			<div className={`box-form ${styles.container}`}>
				<h2 className={styles.title}>Appointment By Tutor</h2>
				<ReportAppointmentTable sortby="tutor" screenEvent="toggle-appointment-by-tutor-report" />
			</div>
		);
	}
}

export default AppointmentByTutorReport;
