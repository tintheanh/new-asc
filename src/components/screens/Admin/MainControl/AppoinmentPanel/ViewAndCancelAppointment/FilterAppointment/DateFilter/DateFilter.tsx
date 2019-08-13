import * as React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { setDateFromFilter, setDateToFilter } from 'redux/store/appointment/action';

class DateFilter extends React.Component<any, any> {
	setDateFrom = (date: Date) => this.props.setDateFromFilter(date);
	setDateTo = (date: Date) => this.props.setDateToFilter(date);
	render() {
		// console.log(this.props.dateFilter);
		return (
			<div>
				<p>From</p>
				<DatePicker
					selected={this.props.dateFilter[0]}
					onChange={this.setDateFrom}
					maxDate={this.props.dateFilter.length < 2 ? null : this.props.dateFilter[1]}
				/>
				<p>To</p>
				<DatePicker
					selected={this.props.dateFilter[1]}
					onChange={this.setDateTo}
					minDate={this.props.dateFilter[0]}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({ dateFilter: state.appointment.data.filter.dateFilter });

export default connect(mapStateToProps, { setDateFromFilter, setDateToFilter })(DateFilter);
