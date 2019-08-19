import * as React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { setDateFromFilter, setDateToFilter } from 'redux/store/appointment/action';
import styles from './styles.module.css';

class DateFilter extends React.Component<any, any> {
	setDateFrom = (date: Date) => this.props.setDateFromFilter(date);
	setDateTo = (date: Date) => this.props.setDateToFilter(date);
	render() {
		// console.log(this.props.dateFilter);
		return (
			<div className={styles.fromTo}>
				<div className={styles.dateInput}>
					<p style={{ marginBottom: 5 }}>From</p>
					<DatePicker
						className="form-control"
						selected={this.props.dateFilter[0]}
						onChange={this.setDateFrom}
						maxDate={this.props.dateFilter.length < 2 ? null : this.props.dateFilter[1]}
						todayButton="Select today"
					/>
				</div>
				<div className={styles.dateInput}>
					<p style={{ marginBottom: 5 }}>To</p>
					<DatePicker
						className="form-control"
						calendarClassName={styles.calendar}
						selected={this.props.dateFilter[1]}
						onChange={this.setDateTo}
						minDate={this.props.dateFilter[0]}
						todayButton="Select today"
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({ dateFilter: state.appointment.data.filter.dateFilter });

export default connect(mapStateToProps, { setDateFromFilter, setDateToFilter })(DateFilter);
