import { NavigationActionTypes, NavigationState, ActionPayload } from './types';

const initialState = {
	route: 'Users'
};

const NavigationReducer = (state: NavigationState = initialState, action: ActionPayload): NavigationState => {
	switch (action.type) {
		case NavigationActionTypes.NAVIGATE:
			return {
				...state,
				route: action.payload
			};
		default:
			return { ...initialState };
	}
};

export default NavigationReducer;
