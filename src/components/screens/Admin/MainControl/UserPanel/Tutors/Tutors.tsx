// Dependencies
import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { TutorsProps } from './props';

// Common & additional component(s)
import { Header } from 'components/common';
import { TutorTable, TutorSubjectTable } from './Tables';
import TutorForm from './TutorForm/TutorForm';
import EditSchedule from './Tables/EditSchedule/EditSchedule';
import DeleteTutor from './DeleteTutor/DeleteTutor';

// Action(s)
import { fetchAllTutors, clear } from 'redux/store/tutor/action';

// Styles
import styles from './styles.module.css';

const Tutors: React.SFC<TutorsProps> = (props) => {
	const { fetchAllTutors, clear } = props;
	React.useEffect(() => {
		// didMount
		fetchAllTutors();

		// willUnmount
		return () => clear();
	}, []);

	return (
		<div>
			<Header title="Tutors" />
			<Link className={styles.backBtn} to="/admin">
				Back
			</Link>
			<div className={styles.tableContainer}>
				<div className={styles.tutorTable}>
					<TutorTable />
				</div>
				<div className={styles.subjectTable}>
					<TutorSubjectTable />
				</div>
			</div>
			<div>
				<TutorForm />
				<EditSchedule />
				<DeleteTutor />
			</div>
		</div>
	);
};

export default connect(null, { fetchAllTutors, clear })(Tutors);
