import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header, Button } from 'components/common';
import back from 'components/common/back.png';
import styles from './styles.module.css';
import SchedulingWindow from './SchedulingWindow/SchedulingWindow';
import NoShowSettings from './NoShowSettings/NoShowSettings';
import { cancelUpdate, updateAppointmentSettings } from 'redux/store/setting/action';

class AppointmentOptions extends React.Component<any, any> {
	performCancelSet = () => this.props.cancelUpdate(this.props.appointmentSettingFetched);
	performUpdate = () => this.props.updateAppointmentSettings(this.props.appointmentSettingUpdated);
	render() {
		return (
			<div>
				<Header title="Appointment Options" />
				<Link className={styles.backBtn} to="/admin">
					<img src={back} alt="" width="35" />
				</Link>
				<SchedulingWindow />
				<NoShowSettings />
				<div className={styles.btnWrapper}>
					<Button label="Save" onClick={this.performUpdate} />
					<Button label="Cancel" onClick={this.performCancelSet} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	appointmentSettingFetched: state.setting.data.appointmentSettingFetched,
	appointmentSettingUpdated: state.setting.data.appointmentSettingUpdated
});

export default connect(mapStateToProps, { cancelUpdate, updateAppointmentSettings })(AppointmentOptions);
