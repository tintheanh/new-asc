import * as React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'components/common';
import StudentAppointment from './StudentAppointment/StudentAppointment';
import { toggleStudentAppointmentModal, clearSignInId } from 'redux/store/navigation/action';

class StudentAppointmentModal extends React.Component<any, any> {
	performClose = () => {
		this.props.toggleStudentAppointmentModal(false, null);
		this.props.clearSignInId();
	};
	render() {
		return (
			<Modal show={this.props.show} close={this.performClose} width="50%">
				<StudentAppointment close={this.performClose} />
			</Modal>
		);
	}
}

const mapStateToProps = (state: any) => ({
	show: state.navigation.studentAppointmentModal,
	signInId: state.navigation.signInId
});

export default connect(mapStateToProps, { toggleStudentAppointmentModal, clearSignInId })(StudentAppointmentModal);
