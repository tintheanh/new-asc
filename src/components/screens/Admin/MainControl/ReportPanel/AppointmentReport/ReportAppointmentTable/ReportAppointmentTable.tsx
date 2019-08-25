import * as React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.css';
import FilterAppointmentForReport from './FilterAppointmentForReport/FilterAppointmentForReport';
import {
  fetchAllAppointments,
  clearStore
} from 'redux/store/appointment/action';

class ReportAppointmentTable extends React.Component<any, any> {
  componentDidMount() {
    this.props.fetchAllAppointments(this.props.sortby);
  }

  componentWillUnmount() {
    this.props.clearStore();
  }

  render() {
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.filter}>
            <FilterAppointmentForReport screenEvent={this.props.screenEvent} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { fetchAllAppointments, clearStore }
)(ReportAppointmentTable);
