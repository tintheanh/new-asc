import * as React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.css';
import { MenuBtn } from 'components/common';
import { LeftMenuProps } from './props';
import { onChangeRoute } from 'redux/store/navigation/action';

class LeftMenu extends React.Component<LeftMenuProps, any> {
	performChangeRoute = (route: string) => () => this.props.onChangeRoute(route);

	render() {
		return (
			<div className={styles.container}>
				<MenuBtn type="main-menu" label="Users" navigate={this.performChangeRoute('Users')} />
				<MenuBtn type="main-menu" label="Appointments" navigate={this.performChangeRoute('Appointments')} />
				<MenuBtn type="main-menu" label="Reports" navigate={this.performChangeRoute('Reports')} />
			</div>
		);
	}
}

export default connect(null, { onChangeRoute })(LeftMenu);
