import * as React from 'react';
import { connect } from 'react-redux';
import { setMinuteBefore, setMinuteAfter } from 'redux/store/setting/action';
import styles from './styles.module.css';

class NoShowSettings extends React.Component<any, any> {
	setMinuteBefore = (event: React.ChangeEvent<HTMLInputElement>) => this.props.setMinuteBefore(event.target.value);

	setMinuteAfter = (event: React.ChangeEvent<HTMLInputElement>) => this.props.setMinuteAfter(event.target.value);

	render() {
		const { appointmentSetting } = this.props;
		if (appointmentSetting) {
			return (
				<div className={`box-form ${styles.container}`}>
					<h4>No-show settings</h4>
					<div>
						Accept a visit as an appointment entry if sign-in time is within{' '}
						<input
							className={styles.minutesInput}
							value={appointmentSetting.visit_minute_interval.before}
							type="number"
							onChange={this.setMinuteBefore}
						/>{' '}
						minutes before or{' '}
						<input
							className={styles.minutesInput}
							value={appointmentSetting.visit_minute_interval.after}
							type="number"
							onChange={this.setMinuteAfter}
						/>{' '}
						after the appointment's start time.
					</div>
				</div>
			);
		}
		return null;
	}
}

const mapStateToProps = (state: any) => ({
	appointmentSetting: state.setting.data.appointmentSettingUpdated
});

export default connect(mapStateToProps, { setMinuteBefore, setMinuteAfter })(NoShowSettings);
