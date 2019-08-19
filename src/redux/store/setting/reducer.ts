import { SettingActionTypes, SettingState, ActionPayload } from './types';

const initialState = {
	// data: {
	// 	appointmentSettingFetched: {
	// 		center_active: {
	// 			from: new Date(),
	// 			to: new Date()
	// 		},
	// 		no_cancelling_allow: {
	// 			day: 'same',
	// 			time_after: ''
	// 		},
	// 		no_setting_allow: {
	// 			day: 'same',
	// 			time_after: ''
	// 		},
	// 		visit_minute_interval: 0,
	// 		weeks_allow: 0
	// 	}
	// },
	// error: ''
	data: {
		appointmentSettingFetched: null,
		appointmentSettingUpdated: null
	},
	error: ''
};

const SettingReducer = (state: SettingState = initialState, action: ActionPayload): SettingState => {
	switch (action.type) {
		case SettingActionTypes.FETCH_APPOINTMENT_SETTINGS_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingFetched: action.payload,
					appointmentSettingUpdated: action.payload
				}
			};
		case SettingActionTypes.FETCH_APPOINTMENT_SETTINGS_FAILURE:
			return { ...state, error: action.payload };
		case SettingActionTypes.SET_CENTER_ACTIVE_FROM:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingUpdated: {
						...state.data.appointmentSettingUpdated!,
						center_active: {
							...state.data.appointmentSettingUpdated!.center_active,
							from: action.payload
						}
					}
				}
			};
		case SettingActionTypes.SET_CENTER_ACTIVE_TO:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingUpdated: {
						...state.data.appointmentSettingUpdated!,
						center_active: {
							...state.data.appointmentSettingUpdated!.center_active,
							to: action.payload
						}
					}
				}
			};
		case SettingActionTypes.SET_WEEKS_ALLOW_APPOINTMENT:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingUpdated: {
						...state.data.appointmentSettingUpdated!,
						weeks_allow: action.payload
					}
				}
			};
		case SettingActionTypes.SET_CANCELLING_ALLOW_DAY:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingUpdated: {
						...state.data.appointmentSettingUpdated!,
						no_cancelling_allow: {
							...state.data.appointmentSettingUpdated!.no_cancelling_allow,
							day: action.payload
						}
					}
				}
			};
		case SettingActionTypes.SET_CANCELLING_ALLOW_TIME:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingUpdated: {
						...state.data.appointmentSettingUpdated!,
						no_cancelling_allow: {
							...state.data.appointmentSettingUpdated!.no_cancelling_allow,
							time_after: action.payload
						}
					}
				}
			};
		case SettingActionTypes.SET_SETTING_ALLOW_DAY:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingUpdated: {
						...state.data.appointmentSettingUpdated!,
						no_setting_allow: {
							...state.data.appointmentSettingUpdated!.no_setting_allow,
							day: action.payload
						}
					}
				}
			};
		case SettingActionTypes.SET_SETTING_ALLOW_TIME:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingUpdated: {
						...state.data.appointmentSettingUpdated!,
						no_setting_allow: {
							...state.data.appointmentSettingUpdated!.no_setting_allow,
							time_after: action.payload
						}
					}
				}
			};
		case SettingActionTypes.SET_MINUTE_BEFORE:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingUpdated: {
						...state.data.appointmentSettingUpdated!,
						visit_minute_interval: {
							...state.data.appointmentSettingUpdated!.visit_minute_interval,
							before: action.payload
						}
					}
				}
			};
		case SettingActionTypes.SET_MINUTE_AFTER:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingUpdated: {
						...state.data.appointmentSettingUpdated!,
						visit_minute_interval: {
							...state.data.appointmentSettingUpdated!.visit_minute_interval,
							after: action.payload
						}
					}
				}
			};
		case SettingActionTypes.UPDATE_APPOINTMENT_SETTING_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingFetched: action.payload
				}
			};
		case SettingActionTypes.UPDATE_APPOINTMENT_SETTING_FAILURE:
			return {
				...state,
				error: action.payload
			};
		case SettingActionTypes.CANCEL_SET:
			return {
				...state,
				data: {
					...state.data,
					appointmentSettingUpdated: action.payload
				}
			};
		default:
			return { ...state };
	}
};

export default SettingReducer;
