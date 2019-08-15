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
import back from 'components/common/back.png';
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
			<div style={{ margin: 12 }}>
				<Link className={styles.backBtn} to="/admin">
					<img src={back} alt="" width="35" />
				</Link>
				<div className={styles.studentTableAndForm}>
					<div style={{ height: 500 }}>
						<StudentTable />
					</div>
					<div>
						<StudentForm />
						<DeleteStudent />
					</div>
				</div>

				<br />
			</div>
		</div>
	);
};

export default connect(null, { fetchAllStudents, clear })(Students);
