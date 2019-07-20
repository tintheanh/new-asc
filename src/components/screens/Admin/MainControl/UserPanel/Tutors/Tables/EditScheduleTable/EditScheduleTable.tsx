import * as React from 'react';
import ReactTable from 'react-table';

import { contains, arraySort } from 'utils/functions';

import DayTable from './DayTable/DayTable';

import { data } from 'config/contants';
import styles from './styles.module.css';

class EditScheduleTable extends React.Component<any, any> {
	private handleKeyDown: any;
	private handleKeyUp: any;
	constructor(props: any) {
		super(props);
		this.state = {
			tutor: this.props.tutor,
			selectedTime: [],
			selectedHours: null,
			timeIndexes: [],
			selectedSchedules: [],
			scheduleIndexes: [],
			toggleSelectShift: false,
			toggleSelectCtrl: false
		};

		// Bind in constructor for cancelling subscriptions when unmount
		// If bind in removeEventListener, this shit will create new references everytime => won't cancelling
		this.handleKeyDown = this.handleOnKey('down').bind(this);
		this.handleKeyUp = this.handleOnKey('up').bind(this);
	}

	componentDidMount() {
		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown);
		document.removeEventListener('keyup', this.handleKeyUp);
	}

	componentDidUpdate(_: any) {
		const { selectedSchedules, selectedTime } = this.state;
		if (selectedSchedules.length && selectedTime.length !== 0) {
			this.setState({ selectedSchedules: [], scheduleIndexes: [] });
		}
	}

	handleOnKey = (behavior: 'up' | 'down') => (e: React.KeyboardEvent) => {
		if (e.keyCode === 91 || e.keyCode === 93)
			this.setState({ toggleSelectCtrl: behavior === 'down' ? true : false, toggleSelectShift: false });
		if (e.keyCode === 16)
			this.setState({ toggleSelectShift: behavior === 'down' ? true : false, toggleSelectCtrl: false });
	};

	selectTimes(hours: any) {
		const index = data.findIndex((hr) => hr.order === hours.order);
		const { toggleSelectShift, selectedTime } = this.state;

		if (toggleSelectShift) {
			const selected = [ ...selectedTime ];
			const timeIndexes = [ ...this.state.timeIndexes ];
			if (selected.length === 0 || !contains(selected, data[index], 'order')) {
				// Appropriate Ascending/Descending Sort to deselecting subject(s)
				if (index > timeIndexes[timeIndexes.length - 1]) {
					timeIndexes.push(index);
					timeIndexes.sort((a, b) => a - b);
					for (let i = timeIndexes[0]; i <= timeIndexes[timeIndexes.length - 1]; i += 1) {
						if (!contains(selected, data[i], 'order')) selected.push(data[i]);
					}
				} else {
					timeIndexes.push(index);
					timeIndexes.sort((a, b) => b - a);
					for (let i = timeIndexes[0]; i >= timeIndexes[timeIndexes.length - 1]; i -= 1) {
						if (!contains(selected, data[i], 'order')) selected.push(data[i]);
					}
				}
				this.setState({ selectedTime: selected, timeIndexes }, () => this.setHours(this.state.selectedTime));
			} else {
				selected.length = 0;
				let newIndexes;
				if (timeIndexes[0] < timeIndexes[timeIndexes.length - 1]) {
					// Deselecting upward
					newIndexes = timeIndexes.filter((i) => i < index);
					newIndexes.push(index);
					for (let i = newIndexes[0]; i <= newIndexes[newIndexes.length - 1]; i += 1) {
						selected.push(data[i]);
					}
				} else {
					// Deselecting downward
					newIndexes = timeIndexes.filter((i) => i > index);
					newIndexes.push(index);
					for (let i = newIndexes[0]; i >= newIndexes[newIndexes.length - 1]; i -= 1) {
						selected.push(data[i]);
					}
				}
				if (newIndexes.length === 1)
					selected.push(index === data.length - 1 ? data[index - 1] : data[index + 1]);
				this.setState({ selectedTime: selected, timeIndexes: newIndexes }, () =>
					this.setHours(this.state.selectedTime)
				);
			}
		} else {
			if (selectedTime.length === 0 || selectedTime[0].time !== data[index].time) {
				this.setState(
					{
						selectedTime:
							index === data.length - 1
								? [ data[index - 1], data[index] ]
								: [ data[index], data[index + 1] ],
						timeIndexes: index === data.length - 1 ? [ index - 1, index ] : [ index, index + 1 ]
					},
					() => this.setHours(this.state.selectedTime)
				);
			} else {
				this.setState({ selectedTime: [], timeIndexes: [], selectedHours: null });
			}
		}
	}

	selectSchedules(schedule: any, day: number) {
		const { toggleSelectCtrl, toggleSelectShift } = this.state;
		const data = this.state.tutor.work_schedule[day];
		const index = data.findIndex((sch: any) => sch.from.order === schedule.from.order);

		if (toggleSelectCtrl) {
			// Crtl Select
			const selectedSchedules = [ ...this.state.selectedSchedules ];
			const indexes = [ ...this.state.scheduleIndexes ];

			if (selectedSchedules.length === 0 || !contains(selectedSchedules, data[index], 'from', 'order')) {
				selectedSchedules.push(data[index]);
				indexes.push(index);
				this.setState({ selectedSchedules, indexes });
			} else {
				// If selectedSchedules contains oncoming schedule, deselect it.
				const newSelectedSubjects = selectedSchedules.filter((sj) => sj.from.order !== data[index].from.order);
				const newIndexes = indexes.filter((i) => i !== index);
				this.setState({ selectedSchedules: newSelectedSubjects, scheduleIndexes: newIndexes });
			}
		} else if (toggleSelectShift) {
			// Shift Select
			const selectedSchedules = [ ...this.state.selectedSchedules ];
			const indexes = [ ...this.state.scheduleIndexes ];
			if (selectedSchedules.length === 0 || !contains(selectedSchedules, data[index], 'from', 'order')) {
				// Appropriate Ascending/Descending Sort to deselecting schedule(s)
				if (index > indexes[indexes.length - 1]) {
					indexes.push(index);
					indexes.sort((a, b) => a - b);
					for (let i = indexes[0]; i <= indexes[indexes.length - 1]; i += 1) {
						if (!contains(selectedSchedules, data[i], 'from', 'order')) selectedSchedules.push(data[i]);
					}
				} else {
					indexes.push(index);
					indexes.sort((a, b) => b - a);
					for (let i = indexes[0]; i >= indexes[indexes.length - 1]; i -= 1) {
						if (!contains(selectedSchedules, data[i], 'from', 'order')) selectedSchedules.push(data[i]);
					}
				}

				this.setState({ selectedSchedules, indexes });
			} else {
				selectedSchedules.length = 0;
				let newIndexes;
				if (indexes[0] < indexes[indexes.length - 1]) {
					// Deselecting upward
					newIndexes = indexes.filter((i) => i < index);
					newIndexes.push(index);
					for (let i = newIndexes[0]; i <= newIndexes[newIndexes.length - 1]; i += 1) {
						selectedSchedules.push(data[i]);
					}
				} else {
					// Deselecting downward
					newIndexes = indexes.filter((i) => i > index);
					newIndexes.push(index);

					for (let i = newIndexes[0]; i >= newIndexes[newIndexes.length - 1]; i -= 1) {
						selectedSchedules.push(data[i]);
					}
				}
				this.setState({ selectedSchedules, scheduleIndexes: newIndexes });
			}
		} else {
			// Single Select
			if (
				this.state.selectedSchedules.length === 0 ||
				this.state.selectedSchedules[0].from.order !== data[index].from.order
			) {
				this.setState({ selectedSchedules: [ data[index] ], scheduleIndexes: [ index ] });
			} else {
				// If selected schedule is the same as oncoming schedule, deselect everything, it's ok b/c single select contains only one schedule.
				this.setState({ selectedSchedules: [], scheduleIndexes: [] });
			}
		}
	}

	setHours = (time: any[]) => {
		const sorted = arraySort(time, 'order');
		const hours = {
			from: sorted[0],
			to: sorted[sorted.length - 1]
		};
		this.setState({ selectedHours: hours });
	};

	isOverlapped = (time1: any, time2: any): boolean => {
		if (
			(time1.from.order < time2.from.order && time1.to.order < time2.from.order) ||
			(time1.from.order > time2.to.order && time1.to.order > time2.to.order)
		) {
			return false;
		}
		return true;
	};

	onAddHours(dayOfWeek: number) {
		const work_schedule = [ ...this.state.tutor.work_schedule ];
		const { selectedHours } = this.state;

		// work_schedule[dayOfWeek].forEach((hour: any) => console.log(this.isOverlapped(this.state.selectedHours, hour)));

		if (this.state.selectedHours) {
			let countOverlapped = 0;
			const processedHours = work_schedule[dayOfWeek].map((hour: any) => {
				if (this.isOverlapped(selectedHours, hour)) {
					countOverlapped += 1;
					if (selectedHours.from.order >= hour.from.order && selectedHours.to.order <= hour.to.order)
						return hour;
					if (selectedHours.from.order <= hour.from.order && selectedHours.to.order <= hour.to.order)
						return {
							from: {
								time: selectedHours.from.time,
								order: selectedHours.from.order
							},
							to: {
								time: hour.to.time,
								order: hour.to.order
							}
						};
					if (selectedHours.from.order >= hour.from.order && selectedHours.to.order >= hour.to.order)
						return {
							from: {
								time: hour.from.time,
								order: hour.from.order
							},
							to: {
								time: selectedHours.to.time,
								order: selectedHours.to.order
							}
						};
				}
				return hour;
			});
			if (countOverlapped === 0) processedHours.push(selectedHours);
			const sorted = processedHours.sort(
				(a: any, b: any) => (a.from.order > b.from.order ? 1 : b.from.order > a.from.order ? -1 : 0)
			);
			work_schedule[dayOfWeek] = sorted;

			const tutor = { ...this.state.tutor, work_schedule };
			this.setState({ tutor, selectedHours: null, selectedTime: [] });
		}
	}

	onDeleteSchedules = (day: number, schedules: any[]) => {
		console.log(schedules);
		const work_schedule = { ...this.state.tutor.work_schedule };

		// console.log(day);

		const newWorkSchedule = work_schedule[day].filter((sch: any) => !contains(schedules, sch, 'from', 'order'));

		console.log(newWorkSchedule);
	};

	render() {
		console.log('rendered');
		const columns = {
			hourPickingColumns: [
				{
					Header: 'Hours',
					accessor: 'time'
				}
			],
			scheduleColumns: [
				{
					id: 'fromTime',
					Header: 'From',
					accessor: (d: any) => d.from.time
				},
				{
					id: 'toTime',
					Header: 'To',
					accessor: (d: any) => d.to.time
				}
			]
		};

		if (this.props.tutor) {
			// console.log(this.state.tutor);
			const { selectedTime, tutor, selectedSchedules } = this.state;
			return (
				<div>
					<h1>{tutor.first_name}</h1>
					<div className={styles.tableContainer}>
						<ReactTable
							className={styles.hourPickingTable}
							defaultPageSize={25}
							data={data}
							columns={columns.hourPickingColumns}
							showPagination={false}
							sortable={false}
							NoDataComponent={() => null}
							getTrProps={(_: any, rowInfo: any) => {
								if (rowInfo && rowInfo.row) {
									const hour = rowInfo.original;
									return {
										onClick: this.selectTimes.bind(this, hour),
										style: {
											background: contains(selectedTime, hour, 'order') ? '#00afec' : 'none',
											color: contains(selectedTime, hour, 'order') ? 'white' : 'black'
										}
									};
								} else {
									return {};
								}
							}}
						/>
						<div className={styles.scheduleTables}>
							{tutor.work_schedule.map((dataSch: any, i: number) => {
								const days = [
									'Monday',
									'Tuesday',
									'Wednesday',
									'Thursday',
									'Friday',
									'Saturday',
									'Sunday'
								];
								return (
									// <DayTable
									// 	key={i}
									// 	isPickingTime={selectedTime.length !== 0}
									// 	day={{ dayOfWeek: days[i], index: i }}
									// 	data={dataSch}
									// 	onAddHours={this.onAddHours.bind(this, i)}
									// 	onDeleteSchedules={this.onDeleteSchedules}
									// />
									<div key={i}>
										<h4>{days[i]}</h4>
										<div onClick={this.onAddHours.bind(this, i)}>
											<ReactTable
												className={styles.scheduleTable}
												data={dataSch}
												columns={columns.scheduleColumns}
												showPagination={false}
												sortable={false}
												NoDataComponent={() => null}
												getTrProps={(_: any, rowInfo: any) => {
													if (rowInfo && rowInfo.row) {
														const schedule = rowInfo.original;
														return {
															onClick: this.selectSchedules.bind(this, schedule, i),
															style: {
																background: contains(
																	selectedSchedules,
																	schedule,
																	'from',
																	'order'
																)
																	? '#00afec'
																	: 'none',
																color: contains(
																	selectedSchedules,
																	schedule,
																	'from',
																	'order'
																)
																	? 'white'
																	: 'black'
															}
														};
													} else {
														return {};
													}
												}}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			);
		}
		return null;
	}
}

export default EditScheduleTable;
