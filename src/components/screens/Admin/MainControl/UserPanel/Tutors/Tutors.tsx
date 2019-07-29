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

// Action(s)
import { fetchAllTutors, toggleAddTutor, clear } from 'redux/store/tutor/actions';

// Styles
import styles from './styles.module.css';

const Tutors: React.SFC<TutorsProps> = (props) => {
	React.useEffect(() => {
		// didMount
		props.fetchAllTutors();
		// willUnmount
		return () => props.clear();
	}, []);

	if (props.data.length) {
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
				</div>
			</div>
		);
	}
	return <h1>Loading</h1>;
};

const mapStateToProps = (state: any) => ({
	data: state.tutor.data.tutors,
	selected: state.tutor.data.selectedTutor
});

export default connect(mapStateToProps, { fetchAllTutors, toggleAddTutor, clear })(Tutors);
