import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { fetchAllAppointments, selectAppointment } from 'redux/store/appointment/action';

class AppointmentTable extends React.Component<any, any> {
	componentDidMount() {
		this.props.fetchAllAppointments('time');
	}

	performSelectAppointment = (appt: any) => () => this.props.selectAppointment(appt);

	render() {
		console.log(this.props.data);
		const columns = [
			{
				id: 'student',
				Header: 'Student',
				accessor: (d: {
					apptDate: number;
					student: { first_name: string; last_name: string; studentId: string };
					time: { from: string; to: string };
					subject: { label: string; full: string };
					tutor: { first_name: string; last_name: string };
				}) => `${d.student.first_name} ${d.student.last_name}`
			},
			{
				id: 'id',
				Header: 'ID',
				accessor: (d: { student: { first_name: string; last_name: string; studentId: string } }) =>
					d.student.studentId
			},
			{
				id: 'appt-date',
				Header: 'Appt Date',
				accessor: (d: { apptDate: number }) => new Date(d.apptDate * 1000).toLocaleDateString('en-US')
			},
			{
				id: 'from',
				Header: 'From',
				accessor: (d: { time: { from: string; to: string } }) => d.time.from
			},
			{
				id: 'to',
				Header: 'To',
				accessor: (d: { time: { from: string; to: string } }) => d.time.to
			},
			{
				id: 'subject',
				Header: 'Subject',
				accessor: (d: { subject: { label: string; full: string } }) => `${d.subject.label} - ${d.subject.full}`
			},
			{
				id: 'tutor',
				Header: 'Tutor',
				accessor: (d: { tutor: { first_name: string; last_name: string } }) =>
					`${d.tutor.first_name} ${d.tutor.last_name}`
			},
			{
				Header: 'Status',
				accessor: 'status'
			}
		];
		const { selectedAppointment } = this.props;
		return (
			<div style={{ width: '100%', height: '100%' }}>
				<ReactTable
					style={{ width: '100%', height: '100%' }}
					columns={columns}
					data={this.props.data}
					showPagination={false}
					getTrProps={(_: any, rowInfo: any) => {
						if (rowInfo && rowInfo.row) {
							const appointment = rowInfo.original;
							if (selectedAppointment) {
								return {
									onClick: this.performSelectAppointment(appointment),
									style: {
										background: rowInfo.original.id === selectedAppointment.id ? '#00afec' : 'none',
										color: rowInfo.original.id === selectedAppointment.id ? 'white' : 'black'
									}
								};
							}
							return {
								onClick: this.performSelectAppointment(appointment)
							};
						} else {
							return {};
						}
					}}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => {
	if (!state.appointment.data.toggleFilter)
		return {
			data: state.appointment.data.appointments,
			selectedAppointment: state.appointment.data.selectedAppointment
		};
	return {
		data: state.appointment.data.filteredAppointments,
		selectedAppointment: state.appointment.data.selectedAppointment
	};
};

export default connect(mapStateToProps, { fetchAllAppointments, selectAppointment })(AppointmentTable);
