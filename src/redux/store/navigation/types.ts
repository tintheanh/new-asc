export enum NavigationActionTypes {
	NAVIGATE = '@@navigate/NAVIGATE'
}

export interface ActionPayload {
	type: string;
	payload: string;
}

export interface NavigationState {
	route: string;
}
