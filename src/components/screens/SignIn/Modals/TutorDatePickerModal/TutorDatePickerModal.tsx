import * as React from 'react';
import { connect } from 'react-redux';
import DatePickerForWorkTrack from './DatePickerForWorkTrack/DatePickerForWorkTrack';
import { Modal } from 'components/common';
import { toggleTutorDatePickerModal } from 'redux/store/navigation/action';

class TutorDatePickerModal extends React.Component<any, any> {
	performClose = () => this.props.toggleTutorDatePickerModal(false);

	render() {
		return (
			<Modal show={this.props.show} close={this.performClose}>
				<DatePickerForWorkTrack />
			</Modal>
		);
	}
}

const mapStateToProps = (state: any) => ({ show: state.navigation.tutorDatePickerModal });

export default connect(mapStateToProps, { toggleTutorDatePickerModal })(TutorDatePickerModal);
