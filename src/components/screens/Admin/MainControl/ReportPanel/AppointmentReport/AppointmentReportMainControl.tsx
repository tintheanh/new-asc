import * as React from 'react';
import { connect } from 'react-redux';
import AppointmentByTutorReport from './AppointmentReportOption/AppointmentByTutorReport/AppointmentByTutorReport';
import AppointmentByStudentReport from './AppointmentReportOption/AppointmentByStudentReport/AppointmentByStudentReport';

class AppointmentReportMainControl extends React.Component<any, any> {
	render() {
		const { appointmentReportOption } = this.props;

		switch (appointmentReportOption) {
			case 'Appointment By Tutor':
				return <AppointmentByTutorReport />;
			case 'Appointment By Student':
				return <AppointmentByStudentReport />;
			default:
				return null;
		}
	}
}

const mapStateToProps = (state: any) => ({
	appointmentReportOption: state.navigation.appointmentReportOption
});

export default connect(mapStateToProps, null)(AppointmentReportMainControl);
