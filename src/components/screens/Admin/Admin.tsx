import * as React from 'react';
import { Header } from 'components/common';
import { connect } from 'react-redux';
import { logoutAndClearTutor } from 'redux/store/tutor/actions';
import { AdminProps } from './props';
import LeftMenu from './LeftMenu/LeftMenu';
import MainControl from './MainControl/MainControl';
import styles from './styles.module.css';

class Admin extends React.Component<AdminProps, any> {
	goBackSignInScreen = (): void => {
		this.props.logoutAndClearTutor();
		this.props.history.push('/');
	};

	render() {
		return (
			<div>
				<Header title="System Administration" />
				<div className={styles.container}>
					<LeftMenu />
					<MainControl />
				</div>
				<div>
					<button onClick={this.goBackSignInScreen}>Return to Sign-In Screen</button>
				</div>
			</div>
		);
	}
}

export default connect(null, { logoutAndClearTutor })(Admin);
