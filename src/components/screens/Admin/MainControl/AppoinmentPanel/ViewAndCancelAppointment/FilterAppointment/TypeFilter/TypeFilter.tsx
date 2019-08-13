import * as React from 'react';
import { connect } from 'react-redux';
import { setTypeFilter, removeTypeFilter } from 'redux/store/appointment/action';

class TypeFilter extends React.Component<any, any> {
	setType = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) this.props.setTypeFilter(e.currentTarget.value);
		else this.props.removeTypeFilter(e.currentTarget.value);
	};
	render() {
		return (
			<div>
				<label>
					<input type="checkbox" checked={this.props.type.has("pending")} value="pending" onChange={this.setType} />
					<span>Pending</span>
				</label>
				<label>
					<input type="checkbox" checked={this.props.type.has("checked")} value="checked" onChange={this.setType} />
					<span>Checked</span>
				</label>
				<label>
					<input type="checkbox" checked={this.props.type.has("no-show")} value="no-show" onChange={this.setType} />
					<span>No-show</span>
				</label>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({ type: state.appointment.data.filter.type });

export default connect(mapStateToProps, { setTypeFilter, removeTypeFilter })(TypeFilter);
