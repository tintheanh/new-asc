import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const deleteUser = functions.https.onCall((data, _) => {
	const { uid } = data;
	if (!(typeof uid === 'string') || uid.length === 0) {
		throw new functions.https.HttpsError(
			'invalid-argument',
			'The function must be called with one arguments "uid" containing the user id to delete.'
		);
	}

	return admin.auth().deleteUser(uid).then(() => {
		console.log('Successfully deleted user');
	});
});
