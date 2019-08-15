import * as React from 'react';
import { connect } from 'react-redux';
import { MenuBtnProps } from './props';
import styles from './styles.module.css';

const MenuBtn: React.SFC<MenuBtnProps> = (props) => {
	const { label, navigate, route, type, reportOption } = props;
	let option;
	if (type === 'main-menu') option = route;
	else option = reportOption;
	return (
		// <button className={styles.menubtn} style={{ background: isSelected ? 'rgb(49, 129, 246)' : 'grey' }}>
		<button
			className={styles.menubtn}
			onClick={navigate}
			style={{ background: option === label ? 'rgb(49, 129, 246)' : 'rgba(0, 0, 0, 0.4)' }}
		>
			{label}
			<span style={{ float: 'right' }}>&#8594;</span>
		</button>
	);
};

const mapStateToProps = (state: any) => ({
	route: state.navigation.route,
	reportOption: state.navigation.reportOption
});

export default connect(mapStateToProps, null)(MenuBtn);
