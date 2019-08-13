import * as React from 'react';
import { connect } from 'react-redux';
import { toggleTutorDatePickerModal, toggleMainTutorModal } from 'redux/store/navigation/action';
import { tutorClockIn, tutorClockOut, logoutAndClearTutor } from 'redux/store/tutor/action';
import { Modal } from 'components/common';

const ipcRenderer = (window as any).ipcRenderer;

class MainTutorModal extends React.Component<any, any> {
	openReportScreen = (event: string) => () => {
		ipcRenderer.send(event, [ this.props.tutorData ]);
	};

	performClose = () => {
		this.props.toggleMainTutorModal(false);
		this.props.logoutAndClearTutor();
	};

	performClockIn = () => {
		this.props.tutorClockIn(this.props.tutorData);
	};

	performClockOut = () => this.props.tutorClockOut(this.props.tutorData.uid, this.props.tutorData.current_log);

	performOpenDatePicker = () => this.props.toggleTutorDatePickerModal(true);

	renderModalContent = () => {
		if (this.props.tutorData) {
			return (
				<div>
					{/* If tutor has not signed in, return clock in btn, otherwise return clock out btn */}
					{this.props.tutorData.current_log === 0 ? (
						<button className="active-btn" onClick={this.performClockIn}>
							clock in
						</button>
					) : (
						<button className="active-btn" onClick={this.performClockOut}>clock out</button>
					)}
					<button className="active-btn" onClick={this.performOpenDatePicker}>Track hours</button>
					<button className="active-btn" onClick={this.openReportScreen('toggle-schedule-report')}>Work schedule</button>
					<button className="active-btn" onClick={this.openReportScreen('toggle-subject-report')}>Subjects</button>
				</div>
			);
		}
		return null;
	};
	render() {
		// console.log(this.props.tutorData);
		return (
			<Modal width="60%" show={this.props.show} close={this.performClose}>
				{this.renderModalContent()}
			</Modal>
		);
	}
}

const mapStateToProps = (state: any) => ({ tutorData: state.tutor.data.tutor, show: state.navigation.mainTutorModal });

export default connect(mapStateToProps, {
	toggleMainTutorModal,
	toggleTutorDatePickerModal,
	tutorClockIn,
	tutorClockOut,
	logoutAndClearTutor
})(MainTutorModal);
