import * as React from 'react';
import TimePicker from 'rc-time-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import { DatePicker } from 'components/common';
import styles from './styles.module.css';
import {
	fetchAppointmentSettings,
	setCenterActiveFrom,
	setCenterActiveTo,
	setWeeksAllowAppointment,
	setCancellingAllowDay,
	setCancellingAllowTime,
	setSettingAllowDay,
	setSettingAllowTime
} from 'redux/store/setting/action';

class SchedulingWindow extends React.Component<any, any> {
	componentDidMount() {
		this.props.fetchAppointmentSettings();
	}

	setDateActiveFrom = (date: Date) => this.props.setCenterActiveFrom(date);

	setDateActiveTo = (date: Date) => this.props.setCenterActiveTo(date);

	setWeeksAllow = (event: React.ChangeEvent<HTMLInputElement>) =>
		this.props.setWeeksAllowAppointment(event.target.value);

	setCancellingAllowDay = (event: React.ChangeEvent<HTMLSelectElement>) =>
		this.props.setCancellingAllowDay(event.target.value);

	setCancellingAllowTime = (time: any) => {
		this.props.setCancellingAllowTime(time.format('hh:mm A'));
	};

	setSettingAllowDay = (event: React.ChangeEvent<HTMLSelectElement>) =>
		this.props.setSettingAllowDay(event.target.value);

	setSettingAllowTime = (time: any) => {
		this.props.setSettingAllowTime(time.format('hh:mm A'));
	};

	render() {
		const { appointmentSetting } = this.props;
		if (appointmentSetting) {
			return (
				<div className={`box-form ${styles.container}`}>
					<h4>Scheduling Window</h4>
					<div>
						Center active from{' '}
						<DatePicker
							className={styles.dateInput}
							selected={appointmentSetting.center_active.from}
							onChange={this.setDateActiveFrom}
							maxDate={appointmentSetting.center_active.to}
							todayButton="Select today"
						/>{' '}
						to{' '}
						<DatePicker
							className={styles.dateInput}
							selected={appointmentSetting.center_active.to}
							onChange={this.setDateActiveTo}
							minDate={appointmentSetting.center_active.from}
							todayButton="Select today"
						/>
					</div>
					<div>
						Only allow appointments{' '}
						<input
							className={styles.weekInput}
							value={appointmentSetting.weeks_allow}
							type="number"
							onChange={this.setWeeksAllow}
						/>{' '}
						weeks in advance
					</div>
					<div>
						Do not allow setting appointments on the{' '}
						<select
							className={styles.dayTypeSelect}
							value={appointmentSetting.no_setting_allow.day}
							onChange={this.setSettingAllowDay}
						>
							<option value="same">same</option>
							<option value="previous">previous</option>
						</select>{' '}
						day after{' '}
						<TimePicker
							className={styles.timepicker}
							showSecond={false}
							format="hh:mm a"
							value={moment(appointmentSetting.no_setting_allow.time_after, 'hh:mm A')}
							onChange={this.setSettingAllowTime}
							use12Hours
						/>
					</div>
					<div>
						Do not allow cancelling appointments on the{' '}
						<select
							className={styles.dayTypeSelect}
							value={appointmentSetting.no_cancelling_allow.day}
							onChange={this.setCancellingAllowDay}
						>
							<option value="same">same</option>
							<option value="previous">previous</option>
						</select>{' '}
						day after{' '}
						<TimePicker
							className={styles.timepicker}
							showSecond={false}
							format="hh:mm a"
							value={moment(appointmentSetting.no_cancelling_allow.time_after, 'hh:mm A')}
							onChange={this.setCancellingAllowTime}
							use12Hours
						/>
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

export default connect(mapStateToProps, {
	fetchAppointmentSettings,
	setCenterActiveFrom,
	setCenterActiveTo,
	setWeeksAllowAppointment,
	setCancellingAllowDay,
	setCancellingAllowTime,
	setSettingAllowDay,
	setSettingAllowTime
})(SchedulingWindow);
