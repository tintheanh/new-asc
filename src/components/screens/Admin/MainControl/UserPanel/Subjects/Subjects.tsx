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
import back from 'components/common/back.png';
import styles from './styles.module.css';

const Subjects: React.SFC<any> = (props) => {
	const { fetchAllSubjects } = props;
	React.useEffect(() => {
		// didMount
		fetchAllSubjects();
		// willUnmount
	}, []);

	return (
		<div>
			<Header title="Subjects" />
			<Link className={styles.backBtn} to="/admin">
				<img src={back} alt="" width="35" />
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
