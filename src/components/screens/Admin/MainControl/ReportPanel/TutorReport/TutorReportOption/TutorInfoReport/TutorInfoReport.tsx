import * as React from 'react';
import ReportTutorTable from '../../ReportTutorTable/ReportTutorTable';
import styles from './styles.module.css';

class TutorInfoReport extends React.Component<any, any> {
	render() {
		return (
			<div className={`box-form ${styles.container}`}>
				<h2 className={styles.title}>Tutor Info</h2>
				<ReportTutorTable screenEvent="toggle-info-report" />
			</div>
		);
	}
}

export default TutorInfoReport;
