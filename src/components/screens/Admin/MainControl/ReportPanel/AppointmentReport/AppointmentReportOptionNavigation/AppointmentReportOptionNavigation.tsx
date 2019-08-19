import * as React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.css';
import { MenuBtn } from 'components/common';
import { onChangeAppointmentReportOption } from 'redux/store/navigation/action';

class AppointmentReportOptionNavigation extends React.Component<any, any> {
	performChangeOption = (option: string) => () => this.props.onChangeAppointmentReportOption(option);

	render() {
		return (
			<div className={styles.container}>
				<MenuBtn
					type="appointment-report-option"
					label="Appointment By Tutor"
					navigate={this.performChangeOption('Appointment By Tutor')}
				/>
				<MenuBtn
					type="appointment-report-option"
					label="Appointment By Student"
					navigate={this.performChangeOption('Appointment By Student')}
				/>
			</div>
		);
	}
}

export default connect(null, { onChangeAppointmentReportOption })(AppointmentReportOptionNavigation);
