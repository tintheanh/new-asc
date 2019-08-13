import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';

admin.initializeApp();

const env = functions.config();
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('students');

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
