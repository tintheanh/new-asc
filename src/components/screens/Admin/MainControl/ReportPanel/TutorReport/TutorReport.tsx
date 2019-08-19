import * as React from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'components/common';
import TutorReportOptionNavigation from './TutorReportOptionNavigation/TutorReportOptionNavigation';
import TutorReportMainControl from './TutorReportMainControl';
import back from 'components/common/back.png';
import styles from './styles.module.css';

class TutorReport extends React.Component<any, any> {
	render() {
		return (
			<div>
				<Header title="Tutor Report" />
				<Link className={styles.backBtn} to="/admin">
					<img src={back} alt="" width="35" />
				</Link>
				<div className={styles.container}>
					<TutorReportOptionNavigation />
					<TutorReportMainControl />
				</div>
			</div>
		);
	}
}

export default TutorReport;
