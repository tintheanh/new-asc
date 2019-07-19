import * as React from 'react';
import { connect } from 'react-redux';
import { MenuBtnProps } from './props';
import styles from './styles.module.css';

const MenuBtn: React.SFC<MenuBtnProps> = (props) => {
	const { label, navigate, route } = props;
	return (
		// <button className={styles.menubtn} style={{ background: isSelected ? 'rgb(49, 129, 246)' : 'grey' }}>
		<button
			className={styles.menubtn}
			onClick={navigate}
			style={{ background: route === label ? 'rgb(49, 129, 246)' : 'grey' }}
		>
			{label}
		</button>
	);
};

const mapStateToProps = (state: any) => ({
	route: state.navigation.route
});

export default connect(mapStateToProps, null)(MenuBtn);
