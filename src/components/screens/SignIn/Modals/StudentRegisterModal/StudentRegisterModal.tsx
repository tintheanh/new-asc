import * as React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'components/common';
import StudentRegister from './StudentRegister/StudentRegister';
import { toggleStudentRegisterModal } from 'redux/store/navigation/action';

class StudentRegisterModal extends React.Component<any, any> {
	performClose = () => this.props.toggleStudentRegisterModal(false);
	render() {
		return (
			<Modal show={this.props.show} close={this.performClose}>
				<StudentRegister signInId={this.props.signInId} close={this.performClose} />
			</Modal>
		);
	}
}

const mapStateToProps = (state: any) => ({
	show: state.navigation.studentRegisterModal,
	signInId: state.navigation.signInId
});

export default connect(mapStateToProps, { toggleStudentRegisterModal })(StudentRegisterModal);
