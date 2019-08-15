import * as React from 'react';
import ReportTutorTable from '../../ReportTutorTable/ReportTutorTable';
import styles from './styles.module.css';

class TutorInfoReport extends React.Component<any, any> {
	render() {
		return (
			<div className={`box-form ${styles.container}`}>
				<ReportTutorTable />
			</div>
		);
	}
}

export default TutorInfoReport;
