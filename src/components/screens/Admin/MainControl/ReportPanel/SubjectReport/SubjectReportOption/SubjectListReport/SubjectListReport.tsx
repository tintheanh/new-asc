import * as React from 'react';
import ReportSubjectTable from '../../ReportSubjectTable/ReportSubjectTable';
import styles from './styles.module.css';

class SubjectListReport extends React.Component<any, any> {
	render() {
		return (
			<div className={`box-form ${styles.container}`}>
				<h2 className={styles.title}>Subject List</h2>
				<ReportSubjectTable withCheckbox={false} screenEvent="toggle-subject-list-report" />
			</div>
		);
	}
}

export default SubjectListReport;
