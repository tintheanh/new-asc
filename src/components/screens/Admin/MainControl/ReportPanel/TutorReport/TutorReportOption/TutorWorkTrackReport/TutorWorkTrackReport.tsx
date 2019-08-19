import * as React from 'react';
import ReportTutorTable from '../../ReportTutorTable/ReportTutorTable';
import styles from './styles.module.css';

class TutorWorkTrackReport extends React.Component<any, any> {
	render() {
		return (
			<div className={`box-form ${styles.container}`}>
				<h2 className={styles.title}>Tutor Hours Track</h2>
				<ReportTutorTable datepicker screenEvent="toggle-work-report" />
			</div>
		);
	}
}

export default TutorWorkTrackReport;
