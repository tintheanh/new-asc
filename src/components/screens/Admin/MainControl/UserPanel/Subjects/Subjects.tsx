// Dependencies
import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
// import { StudentsProps } from './props';

// Common & additional component(s)
import { Header } from 'components/common';
import SubjectTable from './SubjectTable/SubjectTable';
import SubjectForm from './SubjectForm/SubjectForm';
import DeleteSubject from './DeleteSubject/DeleteSubject';

// Action(s)
import { fetchAllSubjects } from 'redux/store/subject/action';

// Styles
import styles from './styles.module.css';

const Subjects: React.SFC<any> = (props) => {
	React.useEffect(() => {
		// didMount
		props.fetchAllSubjects();
		// willUnmount
	}, []);

	return (
		<div>
			<Header title="Subjects" />
			<Link className={styles.backBtn} to="/admin">
				Back
			</Link>
			<div className={styles.contentContainer}>
				<div className={styles.subjectTable}>
					<SubjectTable />
				</div>
				<div>
					<SubjectForm />
					<DeleteSubject />
				</div>
			</div>
		</div>
	);
};

export default connect(null, { fetchAllSubjects })(Subjects);
