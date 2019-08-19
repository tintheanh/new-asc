import * as React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.css';

class StudentAppointment extends React.Component<any, any> {
	render() {
		// const studentAppointmentChecking = {
		// 	apptDate: 1566178200,
		// 	id: '-LmbSzNeHDi7NiID1ArF',
		// 	status: 'checked',
		// 	student: {
		// 		email: 'anht5000@gmail.com',
		// 		first_name: 'Poe',
		// 		last_name: 'Doe',
		// 		studentId: '001832849',
		// 		uid: '5TUWRS8rY5g9qKHpBmAyv22nNdj1'
		// 	},
		// 	subject: {
		// 		full: 'C Programming',
		// 		id: 'mosql7r2zneqV4bxQBdo',
		// 		label: 'CIS 37A'
		// 	},
		// 	time: {
		// 		from: '06:30 PM',
		// 		to: '07:00 PM'
		// 	},

		// 	tutor: {
		// 		email: 'tintheanh@gmail.com',
		// 		first_name: 'Anh',
		// 		last_name: 'Nguyen',
		// 		uid: 'vpnueuhzETTd7d3xCsac6NQsUCq1'
		// 	}
		// };

		const { studentAppointmentChecking } = this.props;
		console.log(this.props.studentAppointmentChecking);
		return (
			<div>
				<h4>You check-in the following appointment at this time:</h4>
				<div className={styles.info}>
					<p>
						Tutor:{' '}
						<strong>
							{studentAppointmentChecking.tutor.first_name} {studentAppointmentChecking.tutor.last_name}
						</strong>
					</p>
					<p>
						Subject:{' '}
						<strong>
							{studentAppointmentChecking.subject.label} - {studentAppointmentChecking.subject.full}
						</strong>
					</p>
					<p>
						Date:{' '}
						<strong>
							{new Date(studentAppointmentChecking.apptDate * 1000).toLocaleDateString('en-US')},{' '}
							{studentAppointmentChecking.time.from} - {studentAppointmentChecking.time.to}
						</strong>
					</p>
					<p>Please have a sit. The tutor will come shortly.</p>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	studentAppointmentChecking: state.navigation.studentAppointmentChecking
});

export default connect(mapStateToProps, null)(StudentAppointment);
