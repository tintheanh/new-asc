import * as React from 'react';
import { connect } from 'react-redux';
import StudentFilter from './StudentFilter/StudentFilter';
import TutorFilter from './TutorFilter/TutorFilter';
import DateFilter from './DateFilter/DateFilter';
import SubjectFilter from './SubjectFilter/SubjectFilter';
import DayFilter from './DayFilter/DayFilter';
import TypeFilter from './TypeFilter/TypeFilter';
import { applyFilter, clearFilter, removeAppointment } from 'redux/store/appointment/action';

class FilterAppointment extends React.Component<any, any> {
	performFilter = () => this.props.applyFilter(this.props.appointments, this.props.filter);

	renderBtnText = () => {
		const { selectedAppointment } = this.props;
		if (selectedAppointment) {
			if (selectedAppointment.status === 'pending') return 'Cancel';
			if (selectedAppointment.status === 'checked') return 'Delete';
			if (selectedAppointment.status === 'no-show') return 'Void';
		}

		return 'Cancel';
	};

	performRemoveAppointment = () => {
		const { appointments, selectedAppointment } = this.props;
		let confirmText: string;
		if (selectedAppointment.status === 'pending')
			confirmText = 'Are you sure to delete this appointment? An email will be sent to notify the student.';
		else if (selectedAppointment.status === 'checked') confirmText = 'Are you sure to delete this appointment?';
		else confirmText = 'Are you sure to void this no-show appointment?';
		if (window.confirm(confirmText)) this.props.removeAppointment(appointments, selectedAppointment);
	};

	render() {
		// console.log(this.props.filter);
		return (
			<div>
				<DateFilter />
				<TutorFilter />
				<StudentFilter />
				<SubjectFilter />
				<DayFilter />
				<TypeFilter />
				<div>
					<button onClick={this.performFilter}>Apply filter</button>
					<button onClick={this.props.clearFilter}>Clear</button>
				</div>
				<div>
					<button disabled={!this.props.selectedAppointment} onClick={this.performRemoveAppointment}>
						{this.renderBtnText()}
					</button>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state: any) => ({
	filter: state.appointment.data.filter,
	appointments: state.appointment.data.appointments,
	selectedAppointment: state.appointment.data.selectedAppointment
});

export default connect(mapStateToProps, { applyFilter, clearFilter, removeAppointment })(FilterAppointment);
