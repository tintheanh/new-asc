// Dependencies
import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { StudentsProps } from './props';

// Common & additional component(s)
import { Header } from 'components/common';
import StudentForm from './StudentForm/StudentForm';
import StudentTable from './StudentTable/StudentTable';
import DeleteStudent from './DeleteStudent/DeleteStudent';

// Action(s)
import { fetchAllStudents, clear } from 'redux/store/student/action';

// Styles
import styles from './styles.module.css';

const Students: React.SFC<StudentsProps> = (props) => {
	const { fetchAllStudents, clear } = props;
	React.useEffect(() => {
		// didMount
		fetchAllStudents();
		// willUnmount
		return () => clear();
	}, []);

	return (
		<div>
			<Header title="Students" />
			<Link className={styles.backBtn} to="/admin">
				Back
			</Link>
			<StudentForm />
			<div className={styles.studentTable}>
				<StudentTable />
			</div>
			<br />
			<div>
				<DeleteStudent />
			</div>
		</div>
	);
};

export default connect(null, { fetchAllStudents, clear })(Students);
