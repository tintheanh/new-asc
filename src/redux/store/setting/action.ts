import { fsdb } from 'index';
import { SettingActionTypes, ActionPayload } from './types';

export const fetchAppointmentSettings = () => async (dispatch: (arg: ActionPayload) => void) => {
	try {
		const appointmentSettingRef = await fsdb.collection('settings').doc('appointment').get();
		const appointmentSettingData = appointmentSettingRef.data();
		if (appointmentSettingData) {
			const appointmentSetting = {
				center_active: {
					from: new Date(appointmentSettingData.center_active.from.seconds * 1000),
					to: new Date(appointmentSettingData.center_active.to.seconds * 1000)
				},
				no_cancelling_allow: { ...appointmentSettingData.no_cancelling_allow },
				no_setting_allow: { ...appointmentSettingData.no_setting_allow },
				visit_minute_interval: appointmentSettingData.visit_minute_interval,
				weeks_allow: appointmentSettingData.weeks_allow
			};
			dispatch({
				type: SettingActionTypes.FETCH_APPOINTMENT_SETTINGS_SUCCESS,
				payload: appointmentSetting
			});
		} else {
			dispatch({
				type: SettingActionTypes.FETCH_APPOINTMENT_SETTINGS_FAILURE,
				payload: 'Could not fetch appointment settings.'
			});
		}
	} catch (err) {
		dispatch({
			type: SettingActionTypes.FETCH_APPOINTMENT_SETTINGS_FAILURE,
			payload: err.message
		});
	}
};

export const setCenterActiveFrom = (date: Date) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SettingActionTypes.SET_CENTER_ACTIVE_FROM,
		payload: date
	});
};

export const setCenterActiveTo = (date: Date) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SettingActionTypes.SET_CENTER_ACTIVE_TO,
		payload: date
	});
};

export const setWeeksAllowAppointment = (weeks: number) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SettingActionTypes.SET_WEEKS_ALLOW_APPOINTMENT,
		payload: Number(weeks)
	});
};

export const setCancellingAllowDay = (day: 'previous' | 'same') => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SettingActionTypes.SET_CANCELLING_ALLOW_DAY,
		payload: day
	});
};

export const setCancellingAllowTime = (time: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SettingActionTypes.SET_CANCELLING_ALLOW_TIME,
		payload: time
	});
};

export const setSettingAllowDay = (day: 'previous' | 'same') => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SettingActionTypes.SET_SETTING_ALLOW_DAY,
		payload: day
	});
};

export const setSettingAllowTime = (time: string) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SettingActionTypes.SET_SETTING_ALLOW_TIME,
		payload: time
	});
};

export const setMinuteBefore = (minutes: number) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SettingActionTypes.SET_MINUTE_BEFORE,
		payload: Number(minutes)
	});
};

export const setMinuteAfter = (minutes: number) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SettingActionTypes.SET_MINUTE_AFTER,
		payload: Number(minutes)
	});
};

export const updateAppointmentSettings = (appointmentSettings: any) => (dispatch: (arg: ActionPayload) => void) => {
	fsdb
		.collection('settings')
		.doc('appointment')
		.update(appointmentSettings)
		.then(() =>
			dispatch({
				type: SettingActionTypes.UPDATE_APPOINTMENT_SETTING_SUCCESS,
				payload: appointmentSettings
			})
		)
		.catch((err) =>
			dispatch({
				type: SettingActionTypes.UPDATE_APPOINTMENT_SETTING_FAILURE,
				payload: err.message
			})
		);
};

export const cancelUpdate = (initalSettings: any) => (dispatch: (arg: ActionPayload) => void) => {
	dispatch({
		type: SettingActionTypes.CANCEL_SET,
		payload: initalSettings
	});
};
