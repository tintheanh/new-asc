import * as React from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'components/common';
import styles from './styles.module.css';
import AppointmentTable from './AppointmentTable/AppointmentTable';
import FilterAppointment from './FilterAppointment/FilterAppointment';
import back from 'components/common/back.png';

class ViewAndCancelAppointment extends React.Component<any, any> {
	render() {
		return (
			<div>
				<Header title="View/Cancel" />
				<Link className={styles.backBtn} to="/admin">
					<img src={back} alt="" width="35" />
				</Link>
				<div className={styles.container}>
					<div className={styles.apptTable}>
						<AppointmentTable />
					</div>
					<div className={styles.filter}>
						<FilterAppointment />
					</div>
				</div>
			</div>
		);
	}
}

export default ViewAndCancelAppointment;
