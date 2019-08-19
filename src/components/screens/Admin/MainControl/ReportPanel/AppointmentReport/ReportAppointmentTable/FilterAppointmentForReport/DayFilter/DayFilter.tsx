import * as React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'components/common';
import { setDayFilter, removeDayFilter } from 'redux/store/appointment/action';
import { workDays } from 'config/contants';

class DayFilter extends React.Component<any, any> {
	setDay = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) this.props.setDayFilter(e.currentTarget.value);
		else this.props.removeDayFilter(e.currentTarget.value);
	};
	setAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			for (let i = 0; i < 7; i++) {
				this.props.setDayFilter(i);
			}
		} else {
			for (let i = 0; i < 7; i++) {
				this.props.removeDayFilter(i);
			}
		}
	};
	renderCheckbox = () => {
		return workDays.map((day: string, i) => (
			<div key={i}>
				<Checkbox checked={this.props.days.has(i)} value={i} labelText={day} onChange={this.setDay} />
			</div>
		));
	};

	checkHasAll = () => {
		for (let i = 0; i < 7; i++) {
			if (!this.props.days.has(i)) return false;
		}
		return true;
	};
	render() {
		return (
			<div>
				<p style={{ marginBottom: 5, marginTop: 5 }}>Day</p>
				<Checkbox checked={this.checkHasAll()} labelText="All days" onChange={this.setAll} />
				{this.renderCheckbox()}
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({ days: state.appointment.data.filter.days });

export default connect(mapStateToProps, { setDayFilter, removeDayFilter })(DayFilter);
