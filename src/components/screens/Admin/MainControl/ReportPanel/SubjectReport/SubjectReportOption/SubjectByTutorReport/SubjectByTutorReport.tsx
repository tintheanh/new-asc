import * as React from 'react';
import ReportSubjectTable from '../../ReportSubjectTable/ReportSubjectTable';
import styles from './styles.module.css';

class SubjectByTutorReport extends React.Component<any, any> {
	render() {
		return (
			<div className={`box-form ${styles.container}`}>
				<h2 className={styles.title}>Subject By Tutor</h2>
				<ReportSubjectTable withCheckbox screenEvent="toggle-subject-by-tutor-report" />
			</div>
		);
	}
}

export default SubjectByTutorReport;
