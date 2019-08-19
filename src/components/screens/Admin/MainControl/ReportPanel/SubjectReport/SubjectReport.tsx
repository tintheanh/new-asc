import * as React from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'components/common';
import SubjectReportOptionNavigation from './SubjectReportOptionNavigation/SubjectReportOptionNavigation';
import SubjectReportMainControl from './SubjectReportMainControl';
import back from 'components/common/back.png';
import styles from './styles.module.css';

class SubjectReport extends React.Component<any, any> {
	render() {
		return (
			<div>
				<Header title="Subject Report" />
				<Link className={styles.backBtn} to="/admin">
					<img src={back} alt="" width="35" />
				</Link>
				<div className={styles.container}>
					<SubjectReportOptionNavigation />
					<SubjectReportMainControl />
				</div>
			</div>
		);
	}
}

export default SubjectReport;
