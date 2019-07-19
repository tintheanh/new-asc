import { SubjectActionTypes, Subject, ActionPayload } from './types';
import { fsdb } from 'index';
import { arraySort } from 'utils/functions';

export const fetchAllSubjects = () => async (dispatch: (arg: ActionPayload) => void) => {
	try {
		const snapshot = await fsdb.collection('subjects').get();
		const subjects: Subject[] = snapshot.docs.map((doc) => {
			if (doc.exists) {
				const subject = doc.data();
				return {
					label: subject.label,
					full: subject.full,
					id: doc.id
				} as Subject;
			}
			return {} as Subject;
		});

		const sorted = arraySort(subjects, 'label');
		dispatch({
			type: SubjectActionTypes.FETCH_ALL_SUBJECTS_SUCCESS,
			payload: {
				data: sorted,
				error: ''
			}
		});
	} catch (err) {
		dispatch({
			type: SubjectActionTypes.FETCH_ALL_SUBJECTS_FAILURE,
			payload: {
				data: [],
				error: err.message
			}
		});
	}
};
