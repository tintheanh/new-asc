import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
	toggleMainTutorModal,
	toggleStudentRegisterModal,
	toggleStudentAppointmentModal,
	setSignInId
} from 'redux/store/navigation/action';
import { Button } from 'components/common';
import { loginAndFetchTutor } from 'redux/store/tutor/action';
import { fetchAppointmentSettings } from 'redux/store/setting/action';
import { studentLogin } from 'redux/store/student/action';
import { checkAppointment } from 'redux/store/appointment/action';
import { InputField } from 'components/common';
import styles from './styles.module.css';

class SignInForm extends React.Component<any, any> {
	state = { loading: false };
	componentDidMount() {
		this.props.fetchAppointmentSettings();
	}

	componentDidUpdate(prevProps: any) {
		if (
			this.props.studentRegisterModal !== prevProps.studentRegisterModal ||
			this.props.mainTutorModal !== prevProps.mainTutorModal ||
			this.props.studentAppointmentModal !== prevProps.studentAppointmentModal
		) {
			this.setState({ loading: false });
		}
	}

	handleTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		this.props.setSignInId(e.target.value);
	};
	handleSubmit = (event: React.FormEvent): void => {
		event.preventDefault();

		if (this.props.signInId) {
			this.setState({ loading: true });
			if (this.props.signInId.includes('00000')) {
				this.props
					.loginAndFetchTutor(this.props.signInId)
					.then(() => {
						if (this.props.tutorData.is_admin) {
							this.props.history.push('/admin');
						} else {
							this.props.toggleMainTutorModal(true);
						}
					})
					.catch((_: Error) => this.props.toggleStudentRegisterModal(true));
			} else {
				this.props
					.studentLogin(this.props.signInId)
					.then(() => {
						console.log('correct');
						if (this.props.settings) {
							this.props
								.checkAppointment(
									this.props.studentData.uid,
									this.props.todayAppointments,
									this.props.settings.visit_minute_interval
								)
								.then((appt: any) => {
									console.log('appt found', appt);
									this.props.toggleStudentAppointmentModal(true, appt);
								})
								.catch((err: any) => {
									alert(err.message);
									this.setState({ loading: false });
								});
						}
					})
					.catch((_: any) => this.props.toggleStudentRegisterModal(true));
			}
		} else alert('Please enter your ID.');
	};

	render() {
		// console.log(this.props.todayAppointments);
		console.log(this.props.settings);
		const { loading } = this.state;
		return (
			<form className={styles.formContainer} onSubmit={this.handleSubmit}>
				<InputField
					type="number"
					placeholder="Enter ID..."
					autoFocus
					value={this.props.signInId}
					onTextChange={this.handleTextChange}
				/>

				<Button disabled={loading} loading={loading} type="submit" label="&#8594;" />
			</form>
		);
	}
}

const mapStateToProps = (state: any) => ({
	settings: state.setting.data.appointmentSettingFetched,
	tutorData: state.tutor.data.tutor,
	signInId: state.navigation.signInId,
	studentData: state.student.data.student,
	todayAppointments: state.appointment.data.todayAppointments,
	mainTutorModal: state.navigation.mainTutorModal,
	studentRegisterModal: state.navigation.studentRegisterModal,
	studentAppointmentModal: state.navigation.studentAppointmentModal
});

const withRouterComp = withRouter(SignInForm);

export default connect(mapStateToProps, {
	toggleMainTutorModal,
	toggleStudentRegisterModal,
	loginAndFetchTutor,
	setSignInId,
	studentLogin,
	checkAppointment,
	toggleStudentAppointmentModal,
	fetchAppointmentSettings
})(withRouterComp);
