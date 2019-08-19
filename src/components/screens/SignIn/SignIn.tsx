// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { SignInProps, SignInStates } from './props';

// Common & additional component(s)
import { Header, InputField, Modal } from 'components/common';
import DatePickerForWorkTrack from './Modals/TutorDatePickerModal/DatePickerForWorkTrack/DatePickerForWorkTrack';
import StudentRegister from './Modals/StudentRegisterModal/StudentRegister/StudentRegister';
import Introduction from './Introduction/Introduction';
import Clock from './Clock/Clock';
import SignInForm from './SignInForm/SignInForm';

import MainTutorModal from './Modals/MainTutorModal/MainTutorModal';
import TutorDatePickerModal from './Modals/TutorDatePickerModal/TutorDatePickerModal';
import StudentRegisterModal from './Modals/StudentRegisterModal/StudentRegisterModal';
import StudentAppointmentModal from './Modals/StudentAppointmentModal/StudentAppointmentModal';

// Action(s)
import { loginAndFetchTutor, logoutAndClearTutor, tutorClockIn, tutorClockOut, clear } from 'redux/store/tutor/action';
import { fetchTodayAppointments } from 'redux/store/appointment/action';

// Styles
import styles from './styles.module.css';

// Tutor sign-in screen

class SignIn extends React.Component<any, any> {
	// shouldComponentUpdate(nextProps: SignInProps, nextState: SignInStates) {
	// 	if (this.props.data !== nextProps.data) return true;
	// 	if (this.state !== nextState) return true;
	// 	return false;
	// }

	componentDidMount() {
		this.props.fetchTodayAppointments();
	}

	render() {
		return (
			<div>
				<Header title="Welcome" />
				<div className={styles.container}>
					<Introduction />
					<SignInForm />
					<Clock />
					<MainTutorModal />
					<TutorDatePickerModal />
					<StudentRegisterModal />
					<StudentAppointmentModal />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	data: state.tutor.data.tutor,
	error: state.tutor.error
});

export default connect(mapStateToProps, {
	loginAndFetchTutor,
	logoutAndClearTutor,
	tutorClockIn,
	tutorClockOut,
	clear,
	fetchTodayAppointments
})(SignIn);
