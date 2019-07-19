import { NavigationActionTypes, ActionPayload } from './types';

export const onChangeRoute = (route: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: NavigationActionTypes.NAVIGATE,
		payload: route
	});
};
