import * as React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.css';
import { MenuBtn } from 'components/common';
import { onChangeTutorReportOption } from 'redux/store/navigation/action';

class TutorReportOptionNavigation extends React.Component<any, any> {
	performChangeOption = (option: string) => () => this.props.onChangeTutorReportOption(option);

	render() {
		return (
			<div className={styles.container}>
				<MenuBtn
					type="tutor-report-option"
					label="Tutor Info"
					navigate={this.performChangeOption('Tutor Info')}
				/>
				<MenuBtn
					type="tutor-report-option"
					label="Tutor Subject"
					navigate={this.performChangeOption('Tutor Subject')}
				/>
				<MenuBtn
					type="tutor-report-option"
					label="Tutor Schedule"
					navigate={this.performChangeOption('Tutor Schedule')}
				/>
				<MenuBtn
					type="tutor-report-option"
					label="Tutor Hours Track"
					navigate={this.performChangeOption('Tutor Hours Track')}
				/>
			</div>
		);
	}
}

export default connect(null, { onChangeTutorReportOption })(TutorReportOptionNavigation);
