import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const ReportPanel = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Report Panel</h1>
			<div className={styles.btnWrapper}>
				<Link className={`btn active-btn ${styles.btn}`} to="/admin/report/tutors">
					TUTORS
				</Link>
			</div>
		</div>
	);
};

export default ReportPanel;
