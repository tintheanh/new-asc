import * as React from 'react';
import { MenuBtnProps } from './props';
import styles from './styles.module.css';

export const MenuBtn: React.SFC<MenuBtnProps> = (props) => {
	console.log(window.location.href);
	const { label } = props;
	return (
		// <button className={styles.menubtn} style={{ background: isSelected ? 'rgb(49, 129, 246)' : 'grey' }}>
		<button className={styles.menubtn}>{label}</button>
	);
};
