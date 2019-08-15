import * as React from 'react';
import { connect } from 'react-redux';
import { toggleTutorDatePickerModal, toggleMainTutorModal, clearSignInId } from 'redux/store/navigation/action';
import { tutorClockIn, tutorClockOut, logoutAndClearTutor } from 'redux/store/tutor/action';
import { Modal, Button } from 'components/common';
import styles from './styles.module.css';
import { getTimeFromUnix, timeDiff } from 'utils/functions';

const ipcRenderer = (window as any).ipcRenderer;

class MainTutorModal extends React.Component<any, any> {
	state = { loading: false, showClockInPrompt: false, showClockOutPrompt: false };

	componentDidUpdate(prevProps: any) {
		if (this.props.tutorData !== prevProps.tutorData) {
			this.setState({ loading: false });
		}
	}

	openReportScreen = (event: string) => () => {
		ipcRenderer.send(event, [ this.props.tutorData ]);
	};

	performClose = () => {
		this.props.toggleMainTutorModal(false);
		this.props.logoutAndClearTutor();
		this.props.clearSignInId();
	};

	performClockIn = () => {
		this.setState({ loading: true }, () => {
			this.props.tutorClockIn(this.props.tutorData);
			setTimeout(() => {
				this.setState({ showClockInPrompt: true }, () => {
					setTimeout(() => {
						this.setState({ showClockInPrompt: false });
					}, 3000);
				});
			}, 100);
		});
	};

	performClockOut = () =>
		this.setState({ loading: true }, () => {
			this.props
				.tutorClockOut(this.props.tutorData.uid, this.props.tutorData.current_log)
				.then(() => {
					setTimeout(() => {
						this.setState({ showClockOutPrompt: true }, () => {
							setTimeout(() => {
								this.setState({ showClockOutPrompt: false });
							}, 3000);
						});
					}, 1000);
				})
				.catch((err: Error) => alert(err.message));
		});

	performOpenDatePicker = () => this.props.toggleTutorDatePickerModal(true);

	renderModalContent = () => {
		if (this.props.tutorData) {
			return (
				<div className={styles.btnWrapper}>
					{/* If tutor has not signed in, return clock in btn, otherwise return clock out btn */}
					{this.props.tutorData.current_log === 0 ? (
						<Button
							customClassName={styles.btn}
							label="CLOCK IN"
							onClick={this.performClockIn}
							loading={this.state.loading}
						/>
					) : (
						<Button
							customClassName={styles.btn}
							label="CLOCK OUT"
							onClick={this.performClockOut}
							loading={this.state.loading}
						/>
					)}
					<Button
						customClassName={styles.btn}
						label="TRACK YOUR HOURS"
						onClick={this.performOpenDatePicker}
					/>
					<Button
						customClassName={styles.btn}
						label="YOUR WORK SCHEDULE"
						onClick={this.openReportScreen('toggle-schedule-report')}
					/>
					<Button
						customClassName={styles.btn}
						label="YOUR SUBJECTS"
						onClick={this.openReportScreen('toggle-subject-report')}
					/>
				</div>
			);
		}
		return null;
	};

	showPrompt = () => {
		const { tutorData } = this.props;
		const { showClockInPrompt, showClockOutPrompt } = this.state;
		if (tutorData) {
			if (showClockInPrompt) {
				return (
					<div className={styles.timeClockPrompt}>
						<p>
							{`${tutorData.first_name} ${tutorData.last_name} log in at`}{' '}
							<strong>{getTimeFromUnix(tutorData.current_log)}</strong>
						</p>
					</div>
				);
			}
			if (showClockOutPrompt) {
				if (this.props.doneTime) {
					return (
						<div className={styles.timeClockPrompt}>
							<p>
								{`${tutorData.first_name} ${tutorData.last_name} log out at`}{' '}
								<strong>{getTimeFromUnix(this.props.doneTime.out)}</strong>
								<br />
								Total: <strong>{timeDiff(this.props.doneTime.in, this.props.doneTime.out)}</strong>
							</p>
						</div>
					);
				}
				return null;
			}
			return null;
		}
		return null;
	};

	render() {
		// console.log(this.props.tutorData);
		return (
			<Modal width="60%" show={this.props.show} close={this.performClose}>
				{this.renderModalContent()}
				{this.showPrompt()}
			</Modal>
		);
	}
}

const mapStateToProps = (state: any) => ({
	tutorData: state.tutor.data.tutor,
	show: state.navigation.mainTutorModal,
	doneTime: state.tutor.data.doneTime
});

export default connect(mapStateToProps, {
	toggleMainTutorModal,
	toggleTutorDatePickerModal,
	tutorClockIn,
	tutorClockOut,
	logoutAndClearTutor,
	clearSignInId
})(MainTutorModal);
