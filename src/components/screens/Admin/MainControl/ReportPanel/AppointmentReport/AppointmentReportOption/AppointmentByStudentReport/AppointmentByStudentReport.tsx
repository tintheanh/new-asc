import * as React from 'react';
import ReportAppointmentTable from '../../ReportAppointmentTable/ReportAppointmentTable';
import styles from './styles.module.css';

class AppointmentByStudentReport extends React.Component<any, any> {
	render() {
		return (
			<div className={`box-form ${styles.container}`}>
				<h2 className={styles.title}>Appointment By Student</h2>
				<ReportAppointmentTable sortby="student" screenEvent="toggle-appointment-by-student-report" />
			</div>
		);
	}
}

export default AppointmentByStudentReport;
