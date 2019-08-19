import * as React from 'react';
import ReportTutorTable from '../../ReportTutorTable/ReportTutorTable';
import styles from './styles.module.css';

class TutorSubjectReport extends React.Component<any, any> {
	render() {
		return (
			<div className={`box-form ${styles.container}`}>
				<h2 className={styles.title}>Tutor Subject</h2>
				<ReportTutorTable screenEvent="toggle-subject-report" />
			</div>
		);
	}
}

export default TutorSubjectReport;
