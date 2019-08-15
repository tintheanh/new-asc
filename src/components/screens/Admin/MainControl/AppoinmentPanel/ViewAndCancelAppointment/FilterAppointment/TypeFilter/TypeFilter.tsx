import * as React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'components/common';
import { setTypeFilter, removeTypeFilter } from 'redux/store/appointment/action';
// import styles from './styles.module.css';

class TypeFilter extends React.Component<any, any> {
	setType = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) this.props.setTypeFilter(e.currentTarget.value);
		else this.props.removeTypeFilter(e.currentTarget.value);
	};
	render() {
		return (
			<div>
				<p style={{ marginTop: 5, marginBottom: 5 }}>Type</p>
				<Checkbox
					checked={this.props.type.has('pending')}
					value="pending"
					labelText="Pending"
					onChange={this.setType}
				/>
				<br />
				<Checkbox
					checked={this.props.type.has('checked')}
					value="checked"
					labelText="Checked"
					onChange={this.setType}
				/>
				<br />
				<Checkbox
					checked={this.props.type.has('no-show')}
					value="no-show"
					labelText="No-show"
					onChange={this.setType}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({ type: state.appointment.data.filter.type });

export default connect(mapStateToProps, { setTypeFilter, removeTypeFilter })(TypeFilter);
