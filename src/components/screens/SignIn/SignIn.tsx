// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { SignInProps, SignInStates } from './props';

// Common & additional component(s)
import { Header, InputField, Modal } from 'components/common';
import logo from './mission-logo.png';
import DatePickerForWorkTrack from './DatePickerForWorkTrack/DatePickerForWorkTrack';
import StudentRegister from './StudentRegister/StudentRegister';

// Action(s)
import { loginAndFetchTutor, logoutAndClearTutor, tutorClockIn, tutorClockOut, clear } from 'redux/store/tutor/action';

// Styles
import styles from './styles.module.css';

const ipcRenderer = (window as any).ipcRenderer;

const dateOptions = {
	weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric'
};

// Tutor sign-in screen

class SignIn extends React.Component<SignInProps, SignInStates> {
	private intervalID: number;

	constructor(props: SignInProps) {
		super(props);
		this.state = {
			time: new Date().toLocaleDateString('us-US', dateOptions), // For realtime clock
			mainModalShow: false, // Modal after successfully sign in
			datePickerModalShow: false, // Date range picking modal
			studentRegisterModalShow: false,
			signInId: '' // Sign-in ID
		};
		this.intervalID = 0;
	}

	componentDidMount() {
		// Clock ticking
		this.intervalID = window.setInterval(
			() =>
				this.setState({
					time: new Date().toLocaleDateString('us-US', dateOptions)
				}),
			1000
		);
	}

	componentWillUnmount() {
		clearInterval(this.intervalID);
	}

	shouldComponentUpdate(nextProps: SignInProps, nextState: SignInStates) {
		if (this.props.data !== nextProps.data) return true;
		if (this.state !== nextState) return true;
		return false;
	}

	handleSubmit = (event: React.FormEvent): void => {
		event.preventDefault();
		this.props
			.loginAndFetchTutor(this.state.signInId)
			.then(() => {
				if (this.props.data.is_admin) {
					this.props.history.push('/admin');
				} else {
					this.handleModalChange('mainModalShow').open();
				}
			})
			.catch((_: Error) => this.handleModalChange('studentRegisterModalShow').open());
	};

	handleModalChange = (key: string) => {
		return {
			open: () => this.setState({ [key]: true }),
			close: () => {
				if (key === 'mainModalShow') {
					this.setState({ [key]: false }, () => this.props.logoutAndClearTutor());
				} else this.setState({ [key]: false });
			}
		};
	};

	handleTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		this.setState({ signInId: e.target.value });
	};

	openReportScreen(event: string): void {
		ipcRenderer.send(event, [ this.props.data ]);
	}

	renderModalContent = (): JSX.Element | null => {
		if (this.props.data) {
			return (
				<div>
					{/* If tutor has not signed in, return clock in btn, otherwise return clock out btn */}
					{this.props.data.current_log === 0 ? (
						<button onClick={() => this.props.tutorClockIn(this.props.data)}>clock in</button>
					) : (
						<button
							onClick={() => this.props.tutorClockOut(this.props.data.uid, this.props.data.current_log)}
						>
							clock out
						</button>
					)}
					<button onClick={this.handleModalChange('datePickerModalShow').open}>Track hours</button>
					<button onClick={this.openReportScreen.bind(this, 'toggle-schedule-report')}>Work schedule</button>
					<button onClick={this.openReportScreen.bind(this, 'toggle-subject-report')}>Subjects</button>
				</div>
			);
		}
		return null;
	};

	render() {
		// console.log(this.props.data);
		// console.log(this.props.error);
		// if (this.props.error) {
		// 	const result = window.confirm(this.props.error);
		// 	if (result) {
		// 		this.props.clear();
		// 	} else {
		// 		this.props.clear();
		// 	}
		// }
		const { time, signInId, mainModalShow, datePickerModalShow, studentRegisterModalShow } = this.state;
		return (
			<div>
				<Header title="Welcome" />
				<div className={styles.container}>
					<img className={styles.logo} src={logo} alt="logo" />
					<div className={styles.instruction}>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi minima rem odit, magnam
							perspiciatis sapiente alias numquam ullam enim dolor earum ratione illo neque itaque vero
							nemo repellendus unde laudantium! Lorem ipsum dolor sit amet consectetur adipisicing elit.
							Sequi minima rem odit, magnam perspiciatis sapiente alias numquam ullam enim dolor earum
							ratione illo neque itaque vero nemo repellendus unde laudantium!
						</p>
					</div>
					<form className={styles.formContainer} onSubmit={this.handleSubmit}>
						<InputField type="number" autoFocus value={signInId} onTextChange={this.handleTextChange} />
						<button type="submit" value="submit">
							Submit
						</button>
					</form>
					<div>
						<p>{time}</p>
					</div>
					<Modal width="60%" show={mainModalShow} close={this.handleModalChange('mainModalShow').close}>
						{this.renderModalContent()}
					</Modal>
					<Modal show={datePickerModalShow} close={this.handleModalChange('datePickerModalShow').close}>
						<DatePickerForWorkTrack />
					</Modal>
					<Modal
						show={studentRegisterModalShow}
						close={this.handleModalChange('studentRegisterModalShow').close}
					>
						<StudentRegister
							signInId={signInId}
							close={this.handleModalChange('studentRegisterModalShow').close}
						/>
					</Modal>
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
	clear
})(SignIn);
