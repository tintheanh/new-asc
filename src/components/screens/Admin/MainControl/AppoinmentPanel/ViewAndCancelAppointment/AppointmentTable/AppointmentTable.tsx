import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { fetchAllAppointments } from 'redux/store/appointment/action';

class AppointmentTable extends React.Component<any, any> {
	componentDidMount() {
		this.props.fetchAllAppointments();
	}

	render() {
		console.log(this.props.data);
		const columns = [
			{
				id: 'student',
				Header: 'Student',
				accessor: (d: {
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
				Header: 'Appt Date',
				accessor: 'apptDate'
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
			}
		];
		return (
			<div style={{ width: '100%', height: '100%' }}>
				<ReactTable
					style={{ width: '100%', height: '100%' }}
					columns={columns}
					data={this.props.data}
					showPagination={false}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	data: state.appointment.data.appointments
});

export default connect(mapStateToProps, { fetchAllAppointments })(AppointmentTable);
