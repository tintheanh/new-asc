export enum SettingActionTypes {
	FETCH_APPOINTMENT_SETTINGS_SUCCESS = '@@setting/FETCH_APPOINTMENT_SETTINGS_SUCCESS',
	FETCH_APPOINTMENT_SETTINGS_FAILURE = '@@setting/FETCH_APPOINTMENT_SETTINGS_FAILURE',

	SET_CENTER_ACTIVE_FROM = '@@setting/SET_CENTER_ACTIVE_FROM',
	SET_CENTER_ACTIVE_TO = '@@setting/SET_CENTER_ACTIVE_TO',

	SET_WEEKS_ALLOW_APPOINTMENT = '@@setting/SET_WEEKS_ALLOW_APPOINTMENT',

	SET_CANCELLING_ALLOW_DAY = '@@setting/SET_CANCELLING_ALLOW_DAY',
	SET_CANCELLING_ALLOW_TIME = '@@setting/SET_CANCELLING_ALLOW_TIME',

	SET_SETTING_ALLOW_DAY = '@@setting/SET_SETTING_ALLOW_DAY',
	SET_SETTING_ALLOW_TIME = '@@setting/SET_SETTING_ALLOW_TIME',

	SET_MINUTE_BEFORE = '@@setting/SET_MINUTE_BEFORE',
	SET_MINUTE_AFTER = '@@setting/SET_MINUTE_AFTER',

  CANCEL_SET = '@@setting/CANCEL_SET',
  
  UPDATE_APPOINTMENT_SETTING_SUCCESS = '@@setting/UPDATE_APPOINTMENT_SETTING_SUCCESS',
  UPDATE_APPOINTMENT_SETTING_FAILURE = '@@setting/UPDATE_APPOINTMENT_SETTING_FAILURE'
}

export interface ActionPayload {
	type: string;
	payload: any;
}

export interface AppointmentSettings {
	center_active: {
		from: Date;
		to: Date;
	};
	no_cancelling_allow: {
		day: 'previous' | 'same';
		time_after: string;
	};
	no_setting_allow: {
		day: 'previous' | 'same';
		time_after: string;
	};
	visit_minute_interval: {
		before: number;
		after: number;
	};
	weeks_allow: number;
}

export interface SettingState {
	data: {
		appointmentSettingFetched: AppointmentSettings | null;
		appointmentSettingUpdated: AppointmentSettings | null;
	};
	error: string;
}
