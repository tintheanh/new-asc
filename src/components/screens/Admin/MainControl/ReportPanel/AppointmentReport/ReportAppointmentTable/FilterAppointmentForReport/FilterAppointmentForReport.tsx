import * as React from 'react';
import { connect } from 'react-redux';
import StudentFilter from './StudentFilter/StudentFilter';
import TutorFilter from './TutorFilter/TutorFilter';
import DateFilter from './DateFilter/DateFilter';
import SubjectFilter from './SubjectFilter/SubjectFilter';
import DayFilter from './DayFilter/DayFilter';
import TypeFilter from './TypeFilter/TypeFilter';
import { applyFilter, clearFilter } from 'redux/store/appointment/action';
import { Button } from 'components/common';
import { getEpochOfTime } from 'utils/functions';
import styles from './styles.module.css';

const ipcRenderer = (window as any).ipcRenderer;

class FilterAppointmentForReport extends React.Component<any, any> {
	performFilterAndOpenReportScreen = (event: string) => () => {
		this.props.applyFilter(this.props.data, this.props.filter);

		setTimeout(() => {
			let sending: any;

			if (this.props.filter.dateFilter[0] && this.props.filter.dateFilter[1]) {
				sending = {
					dateFilter: [
						getEpochOfTime(this.props.filter.dateFilter[0]),
						getEpochOfTime(this.props.filter.dateFilter[1])
					],
					appointments: this.props.data
				};
			} else {
				sending = {
					dateFilter: this.props.filter.dateFilter,
					appointments: this.props.data
				};
			}
			ipcRenderer.send(event, sending);
			this.props.clearFilter();
		}, 100);
	};

	componentWillUnmount() {
		this.props.clearFilter();
	}

	render() {
		console.log(this.props.data);
		// console.log(this.props.toggleFilter);
		return (
			<div>
				<div className={`box-form ${styles.container}`}>
					<DateFilter />
					<TutorFilter />
					<StudentFilter />
					<SubjectFilter />
					<div className={styles.dayAndTypeFilter}>
						<DayFilter />
						<TypeFilter />
					</div>

					<div className={styles.applyAndClear}>
						<Button
							label="Show report"
							onClick={this.performFilterAndOpenReportScreen(this.props.screenEvent)}
						/>
						<Button label="Clear" onClick={this.props.clearFilter} />
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state: any) => {
	if (!state.appointment.data.toggleFilter) {
		return {
			data: state.appointment.data.appointments,
			filter: state.appointment.data.filter
		};
	}
	return {
		data: state.appointment.data.filteredAppointments,
		filter: state.appointment.data.filter
	};
};

export default connect(mapStateToProps, { applyFilter, clearFilter })(FilterAppointmentForReport);
