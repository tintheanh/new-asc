import { AppointmentActionTypes, AppointmentState, ActionPayload } from './types';

const initialState = {
	data: {
		todayAppointments: [],
		studentPrompt: '',
		appointments: [],
		filteredAppointments: [],
		selectedAppointment: null,
		toggleFilter: false,
		filter: {
			dateFilter: [ null, null ],
			tutors: [],
			tutor: null,
			student: null,
			subject: null,
			days: new Set(),
			type: new Set()
		}
	},
	error: ''
};

const AppointmentReducer = (state: AppointmentState = initialState, action: ActionPayload): AppointmentState => {
	switch (action.type) {
		case AppointmentActionTypes.FETCH_ALL_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					appointments: action.payload.data.appointments
				}
			};
		case AppointmentActionTypes.FETCH_ALL_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case AppointmentActionTypes.FETCH_TODAY_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					todayAppointments: action.payload.data.todayAppointments
				}
			};
		case AppointmentActionTypes.FETCH_ALL_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case AppointmentActionTypes.SELECT_APPOINTMENT:
			return {
				...state,
				data: {
					...state.data,
					selectedAppointment: action.payload.data.selectedAppointment
				}
			};
		case AppointmentActionTypes.REMOVE_APPOINTMENT_SUCCESS:
			return {
				...state,
				data: {
					...state.data,
					appointments: action.payload.data.appointments
				}
			};
		case AppointmentActionTypes.REMOVE_APPOINTMENT_FAILURE:
			return {
				...state,
				error: action.payload.error
			};
		case AppointmentActionTypes.SET_DATE_FROM_FILTER: {
			let dates;
			if (state.data.filter.dateFilter.length < 2) dates = [ ...action.payload.data.filter.dateFilter ];
			else {
				dates = [ ...state.data.filter.dateFilter ];
				dates[0] = action.payload.data.filter.dateFilter[0];
			}
			return {
				...state,
				data: {
					...state.data,
					filter: {
						...state.data.filter,
						dateFilter: dates
					}
				}
			};
		}
		case AppointmentActionTypes.SET_DATE_TO_FILTER: {
			let dates;
			if (state.data.filter.dateFilter.length < 2)
				dates = [ ...state.data.filter.dateFilter, ...action.payload.data.filter.dateFilter ];
			else {
				dates = [ ...state.data.filter.dateFilter ];
				dates[1] = action.payload.data.filter.dateFilter[0];
			}
			return {
				...state,
				data: {
					...state.data,
					filter: {
						...state.data.filter,
						dateFilter: dates
					}
				}
			};
		}
		case AppointmentActionTypes.SET_STUDENT_FILTER:
			return {
				...state,
				data: {
					...state.data,
					filter: {
						...state.data.filter,
						student: action.payload.data.filter.student
					}
				}
			};
		case AppointmentActionTypes.SET_TUTOR_FILTER:
			return {
				...state,
				data: {
					...state.data,
					filter: {
						...state.data.filter,
						tutor: action.payload.data.filter.tutor
					}
				}
			};
		case AppointmentActionTypes.SET_SUBJECT_FILTER:
			return {
				...state,
				data: {
					...state.data,
					filter: {
						...state.data.filter,
						subject: action.payload.data.filter.subject
					}
				}
			};
		case AppointmentActionTypes.SET_DAY_FILTER: {
			const mergedSet = new Set([ ...state.data.filter.days, ...action.payload.data.filter.days ]);
			return {
				...state,
				data: {
					...state.data,
					filter: {
						...state.data.filter,
						days: mergedSet
					}
				}
			};
		}
		case AppointmentActionTypes.REMOVE_DAY_FILTER: {
			const mergedSet = new Set([ ...state.data.filter.days ]);
			mergedSet.delete([ ...action.payload.data.filter.days ][0]);
			return {
				...state,
				data: {
					...state.data,
					filter: {
						...state.data.filter,
						days: mergedSet
					}
				}
			};
		}
		case AppointmentActionTypes.SET_TYPE_FILTER: {
			const mergedSet = new Set([ ...state.data.filter.type, ...action.payload.data.filter.type ]);
			return {
				...state,
				data: {
					...state.data,
					filter: {
						...state.data.filter,
						type: mergedSet
					}
				}
			};
		}
		case AppointmentActionTypes.REMOVE_TYPE_FILTER: {
			const mergedSet = new Set([ ...state.data.filter.type ]);
			mergedSet.delete([ ...action.payload.data.filter.type ][0]);
			return {
				...state,
				data: {
					...state.data,
					filter: {
						...state.data.filter,
						type: mergedSet
					}
				}
			};
		}
		case AppointmentActionTypes.APPLY_FILTER:
			return {
				...state,
				data: {
					...state.data,
					filteredAppointments: action.payload.data.filteredAppointments,
					toggleFilter: action.payload.data.toggleFilter
				}
			};
		case AppointmentActionTypes.CLEAR_FILTER:
			return {
				...state,
				data: {
					...state.data,
					toggleFilter: action.payload.data.toggleFilter,
					filter: {
						...state.data.filter,
						dateFilter: action.payload.data.filter.dateFilter,
						tutor: action.payload.data.filter.tutor,
						student: action.payload.data.filter.student,
						subject: action.payload.data.filter.subject,
						days: action.payload.data.filter.days,
						type: action.payload.data.filter.type
					}
				}
			};
		case AppointmentActionTypes.FETCH_TUTORS_FILTER_SUCCESS: {
			return {
				...state,
				data: {
					...state.data,
					filter: {
						...state.data.filter,
						tutors: action.payload.data.filter.tutors
					}
				}
			};
		}
		case AppointmentActionTypes.FETCH_TUTORS_FILTER_FAILURE: {
			return {
				...state,
				error: action.payload.error
			};
		}
		default:
			return { ...state };
	}
};

export default AppointmentReducer;
