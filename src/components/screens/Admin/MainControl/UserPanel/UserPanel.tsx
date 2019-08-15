import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

export const UserPanel = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>User Panel</h1>
			<div className={styles.btnWrapper}>
				<Link className={`btn active-btn ${styles.btn}`} to="/admin/tutors">
					TUTORS
				</Link>
				<Link className={`btn active-btn ${styles.btn}`} to="/admin/students">
					STUDENTS
				</Link>
				<Link className={`btn active-btn ${styles.btn}`} to="/admin/subjects">
					SUBJECTS
				</Link>
			</div>
		</div>
	);
};
