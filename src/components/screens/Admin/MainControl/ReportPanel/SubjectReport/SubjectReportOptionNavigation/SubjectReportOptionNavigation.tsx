import * as React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.css';
import { MenuBtn } from 'components/common';
import { onChangeSubjectReportOption } from 'redux/store/navigation/action';

class SubjectReportOptionNavigation extends React.Component<any, any> {
	performChangeOption = (option: string) => () => this.props.onChangeSubjectReportOption(option);

	render() {
		return (
			<div className={styles.container}>
				<MenuBtn
					type="subject-report-option"
					label="Subject List"
					navigate={this.performChangeOption('Subject List')}
				/>
				<MenuBtn
					type="subject-report-option"
					label="Subject By Tutor"
					navigate={this.performChangeOption('Subject By Tutor')}
				/>
			</div>
		);
	}
}

export default connect(null, { onChangeSubjectReportOption })(SubjectReportOptionNavigation);
