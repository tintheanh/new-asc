import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toggleMainTutorModal, toggleStudentRegisterModal, setSignInId } from 'redux/store/navigation/action';
import { Button } from 'components/common';
import { loginAndFetchTutor } from 'redux/store/tutor/action';
import { studentLogin } from 'redux/store/student/action';
import { checkAppointment } from 'redux/store/appointment/action';
import { InputField } from 'components/common';
import styles from './styles.module.css';

class SignInForm extends React.Component<any, any> {
	state = { loading: false };

	componentDidUpdate(prevProps: any) {
		if (
			this.props.studentRegisterModal !== prevProps.studentRegisterModal ||
			this.props.mainTutorModal !== prevProps.mainTutorModal
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
						this.props.checkAppointment(this.props.studentData.uid, this.props.todayAppointments);
					})
					.catch((_: any) => this.props.toggleStudentRegisterModal(true));
			}
		} else alert('Please enter your ID.');
	};

	render() {
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
	tutorData: state.tutor.data.tutor,
	signInId: state.navigation.signInId,
	studentData: state.student.data.student,
	todayAppointments: state.appointment.data.todayAppointments,
	mainTutorModal: state.navigation.mainTutorModal,
	studentRegisterModal: state.navigation.studentRegisterModal
});

const withRouterComp = withRouter(SignInForm);

export default connect(mapStateToProps, {
	toggleMainTutorModal,
	toggleStudentRegisterModal,
	loginAndFetchTutor,
	setSignInId,
	studentLogin,
	checkAppointment
})(withRouterComp);
