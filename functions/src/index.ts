import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';

admin.initializeApp();

const env = functions.config();
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('students');

const getShift = (workDay: any[], appt_id: string) => {
	for (let i = 0; i < workDay.length; i++) {
		if (workDay[i].appointments) {
			if (workDay[i].appointments[appt_id]) {
				return i;
			}
		}
	}
	return -1;
};

export const indexStudent = functions.firestore.document('students/{studentID}').onCreate((snap, _) => {
	const data = snap.data();
	const objId = snap.id;
	return index.saveObject({ objectID: objId, ...data });
});

export const unIndexStudent = functions.firestore.document('students/{studentID}').onDelete((snap, _) => {
	const objId = snap.id;
	return index.deleteObject(objId);
});

export const updateIndexStudent = functions.firestore.document('students/{studentID}').onUpdate((change, _) => {
	const newData = change.after.data();
	const objId = change.after.id;
	return index.saveObject({ objectID: objId, ...newData });
});

export const deleteUser = functions.https.onCall((data, context) => {
	const { uid } = data;
	if (!(typeof uid === 'string') || uid.length === 0) {
		throw new functions.https.HttpsError(
			'invalid-argument',
			'The function must be called with one arguments "uid" containing the user id to delete.'
		);
	}

	if (context.auth) {
		return admin.auth().deleteUser(uid).then(() => {
			console.log('Successfully deleted user');
		});
	} else {
		throw new functions.https.HttpsError('permission-denied', 'The function must be called with authentication.');
	}
});

export const removeUndefinedSubjectsFromTutors = functions.firestore
	.document('subjects/{subjectID}')
	.onDelete(async (snap, _) => {
		const subjectId = snap.id;
		try {
			const snapshot = await admin.firestore().collection('tutors').get();
			snapshot.docs.forEach((doc) => {
				if (doc.exists) {
					if (doc.data().subjects.includes(subjectId)) {
						admin
							.firestore()
							.collection('tutors')
							.doc(doc.id)
							.update({ subjects: admin.firestore.FieldValue.arrayRemove(subjectId) })
							.catch((err) => console.log(err.message));
					}
				}
			});
		} catch (err) {
			console.log(err.message);
		}
	});

export const checkPastAppointments = functions.pubsub.topic('check-my-appointments').onPublish(async (message) => {
	return admin.database().ref('appointments').once('value').then((apptRef) => {
		if (apptRef) {
			const now = Math.floor(new Date().getTime() / 1000);
			console.log(now);
			apptRef.forEach((doc) => {
				if (doc.val().apptDate <= now) {
					const apptKey = doc.key;
					admin
						.database()
						.ref(`appointments/${apptKey}`)
						.remove()
						.then(() => {
							const pastAppt = { ...doc.val() };
							pastAppt.status = 'no-show';
							admin
								.database()
								.ref('past-appointments')
								.child(apptKey as string)
								.set(pastAppt)
								.then(async () => {
									const { tutor_id, apptDate, student_id } = pastAppt;
									const day = new Date((apptDate - 25200) * 1000).getDay();
									const workDayRef = await admin
										.database()
										.ref(`tutors/${tutor_id}/work_schedule/${day}`)
										.once('value');
									const workDay = workDayRef.val();
									const index = getShift(workDay, apptKey as string);
									if (index > -1) {
										admin
											.database()
											.ref(
												`tutors/${tutor_id}/work_schedule/${day}/${index}/appointments/${apptKey}`
											)
											.remove()
											.then(async () => {
												// console.log('student', student_id);
												const studentRef = await admin
													.firestore()
													.collection('students')
													.doc(student_id)
													.get();
												if (studentRef.exists) {
													const update = {
														no_show: studentRef.data()!.no_show + 1
													};
													admin
														.firestore()
														.collection('students')
														.doc(student_id)
														.update(update)
														.then(() => console.log('Done.'))
														.catch((err) => console.log(err.message));
												}
											})
											.catch((err) => console.log(err.message));
									} else console.log('cannot find index');
								});
						})
						.catch((err) => console.log(err.message));
				}
			});
		}
	});
});
