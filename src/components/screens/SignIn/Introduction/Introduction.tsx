import * as React from 'react';
import logo from 'components/common/mission-logo.png';
import styles from './styles.module.css';

const Introduction = () => (
	<div>
		<img className={styles.logo} src={logo} alt="logo" />
		<div className={`${styles.instruction} box-form`}>
			<p>
				Welcome to the ASC Tutoring Center! <br />
				Please enter "00 + your student ID" to log in. If you are a new user, you will be asked to answer
				several questions in the next popup. These questions are for statistical purpose only and you will only
				have to answer them on your first visit. Please see the learning center staff if you need help with any
				of the questions. <br />Thank you!
			</p>
		</div>
	</div>
);

export default Introduction;
