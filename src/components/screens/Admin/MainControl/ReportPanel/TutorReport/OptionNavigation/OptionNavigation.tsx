import * as React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.css';
import { MenuBtn } from 'components/common';
import { onChangeReportOption } from 'redux/store/navigation/action';

class OptionNavigation extends React.Component<any, any> {
	performChangeOption = (option: string) => () => this.props.onChangeReportOption(option);

	render() {
		return (
			<div className={styles.container}>
				<MenuBtn type="report-option" label="Tutor Info" navigate={this.performChangeOption('Tutor Info')} />
        <MenuBtn type="report-option" label="Tutor Subject" navigate={this.performChangeOption('Tutor Subject')} />
			</div>
		);
	}
}

export default connect(null, { onChangeReportOption })(OptionNavigation);
