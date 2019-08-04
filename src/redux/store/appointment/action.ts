import { fbdb, fsdb } from 'index';
import { AppointmentActionTypes, Appointment, ActionPayload } from './types';

const fetchAppointment = (id: string) => {
	return new Promise(async (resolve, reject) => {
		try {
			const apptSnapshot = await fbdb.ref(`appointments/${id}`).once('value');
			const obj = apptSnapshot.val();
			if (obj) {
				const studentSnapshot = await fsdb.collection('students').doc(obj.student_id).get();
				const tutorSnapshot = await fsdb.collection('tutors').doc(obj.tutor_id).get();
				const subjectSnapshot = await fsdb.collection('subjects').doc(obj.subject_id).get();
				if (studentSnapshot.exists && tutorSnapshot.exists && subjectSnapshot.exists) {
					const appointment = {
						id: apptSnapshot.key,
						apptDate: obj.apptDate,
						student: {
              uid: obj.student_id,
							first_name: studentSnapshot.data()!.first_name,
              studentId: studentSnapshot.data()!.studentId,
							last_name: studentSnapshot.data()!.last_name
						},
						subject: {
							id: obj.subject_id,
							label: subjectSnapshot.data()!.label,
							full: subjectSnapshot.data()!.full
						},
						time: obj.time,
						tutor: {
							uid: obj.tutor_id,
							first_name: tutorSnapshot.data()!.first_name,
							last_name: tutorSnapshot.data()!.last_name
						}
					};
					resolve(appointment);
				} else {
					reject(new Error('Could not find data.'));
				}
			} else {
				reject(new Error('Could not find data.'));
			}
		} catch (err) {
			reject(err);
		}
	});
};

export const fetchAllAppointments = () => async (dispatch: (arg: ActionPayload) => void) => {
	try {
		const keys: string[] = [];
		const snapshot = await fbdb.ref('appointments').once('value');
		snapshot.forEach((data) => {
			if (data.key) {
				keys.push(data.key);
			}
		});

		const appointments = await Promise.all(keys.map((key) => fetchAppointment(key))) as Appointment[];

		dispatch({
			type: AppointmentActionTypes.FETCH_ALL_SUCCESS,
			payload: {
				data: {
					appointments,
					selectedAppointment: null
				},
				error: ''
			}
		});
	} catch (err) {
		dispatch({
			type: AppointmentActionTypes.FETCH_ALL_FAILURE,
			payload: {
				data: {
					appointments: [],
					selectedAppointment: null
				},
				error: err.message
			}
		});
	}
};
