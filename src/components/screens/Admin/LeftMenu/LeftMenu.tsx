import * as React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.css';
import { MenuBtn } from 'components/common';
import { LeftMenuProps } from './props';
import { onChangeRoute } from 'redux/store/navigation/action';

class LeftMenu extends React.Component<LeftMenuProps, any> {
	startNavigating = (route: string): void => {
		this.props.onChangeRoute(route);
	};

	render() {
		return (
			<div className={styles.container}>
				<MenuBtn label="Users" navigate={this.props.onChangeRoute.bind(this, 'Users')} />
				<MenuBtn label="View Appointments" navigate={this.props.onChangeRoute.bind(this, 'View Appointments')} />
				{/* <MenuBtn label="View Appoinments" />
				<MenuBtn label="System" /> */}
			</div>
		);
	}
}

export default connect(null, { onChangeRoute })(LeftMenu);
