import * as React from 'react';
import { connect } from 'react-redux';
import { MainControlProps } from './props';
import { UserPanel, AppoinmentPanel } from './index';

class MainControl extends React.Component<MainControlProps, any> {
	render() {
		const { route } = this.props;

		switch (route) {
			case 'Users':
				return <UserPanel />;
			case 'View Appointments':
				return <AppoinmentPanel />;
			default:
				return null;
		}
	}
}

const mapStateToProps = (state: any) => ({
	route: state.navigation.route
});

export default connect(mapStateToProps, null)(MainControl);
