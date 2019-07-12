import * as React from 'react';
import styles from './styles.module.css';
import { MenuBtn } from 'components/common';

const LeftMenu = () => {
	return (
		<div className={styles.container}>
			<MenuBtn label="Users" />
			<MenuBtn label="View Appoinments" />
			<MenuBtn label="System" />
		</div>
	);
};

export default LeftMenu;
