import * as React from 'react';
import ReportTutorTable from '../../ReportTutorTable/ReportTutorTable';
import styles from './styles.module.css';

class TutorScheduleReport extends React.Component<any, any> {
	render() {
		return (
			<div className={`box-form ${styles.container}`}>
				<h2 className={styles.title}>Tutor Schedule</h2>
				<ReportTutorTable screenEvent="toggle-schedule-report" />
			</div>
		);
	}
}

export default TutorScheduleReport;
