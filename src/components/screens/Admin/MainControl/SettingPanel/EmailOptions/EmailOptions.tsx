import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header, Button } from 'components/common';
import back from 'components/common/back.png';
import styles from './styles.module.css';

class EmailOptions extends React.Component<any, any> {
	render() {
		return (
			<div>
				<Header title="Email Options" />
				<Link className={styles.backBtn} to="/admin">
					<img src={back} alt="" width="35" />
				</Link>
			</div>
		);
	}
}

export default EmailOptions;
