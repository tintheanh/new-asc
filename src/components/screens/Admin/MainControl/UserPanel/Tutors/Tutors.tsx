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
import OffTimes from './OffTimes/OffTimes';

// Action(s)
import { fetchAllTutors, clear } from 'redux/store/tutor/action';

// Styles
import back from 'components/common/back.png';
import styles from './styles.module.css';

class Tutors extends React.Component<any, any> {
  componentDidMount() {
    this.props.fetchAllTutors();
  }
  render() {
    return (
      <div>
        <Header title="Tutors" />
        <Link className={styles.backBtn} to="/admin">
          <img src={back} alt="" width="35" />
        </Link>
        <div className={styles.tableContainer}>
          <div className={styles.tutorTable}>
            <TutorTable />
          </div>
          <div className={styles.subjectTable}>
            <TutorSubjectTable />
          </div>
        </div>
        <div className={styles.tutorModifyContainer}>
          <TutorForm />
          <div>
            <EditSchedule />
            <OffTimes />
            <DeleteTutor />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { fetchAllTutors, clear }
)(Tutors);
