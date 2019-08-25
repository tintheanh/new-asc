import * as React from 'react';
import ReactTable from 'react-table';
import { contains } from 'utils/functions';

import { DayTablesProps, DayTablesStates } from './props';
import { Schedule, data } from 'config';

import styles from './styles.module.css';
import { workDays } from 'config';

class DayTables extends React.Component<DayTablesProps, DayTablesStates> {
	constructor(props: DayTablesProps) {
		super(props);
		this.state = {
			selectedSchedules: [],
			scheduleIndexes: [],
			currentDay: 0
		};
	}

	componentDidMount() {
		document.addEventListener('keydown', (this.handleKeyDown as unknown) as EventListener);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', (this.handleKeyDown as unknown) as EventListener);
	}

	handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.keyCode === 8 || e.keyCode === 46) {
			this.props.onDeleteSchedules(this.state.currentDay, this.state.selectedSchedules);
			this.setState({ selectedSchedules: [], scheduleIndexes: [] });
		}
	};

	componentDidUpdate(prevProps: DayTablesProps) {
		const { selectedSchedules } = this.state;
		if (selectedSchedules.length && this.props.isPickingTime !== prevProps.isPickingTime) {
			this.setState({ selectedSchedules: [], scheduleIndexes: [] });
		}
	}

	shouldComponentUpdate(nextProps: DayTablesProps, nextState: DayTablesStates) {
		if (this.props.schedules !== nextProps.schedules) return true;
		if (this.state.selectedSchedules !== nextState.selectedSchedules) return true;
		if (this.props.isPickingTime === nextProps.isPickingTime) return false;
		return true;
	}

	selectSchedules = (schedule: Schedule, day: number) => () => {
		const { toggleSelectCtrl, toggleSelectShift, schedules } = this.props;
		const data = schedules[day];
		this.setState({ currentDay: day });
		const index = data.findIndex((sch) => sch.from.order === schedule.from.order);

		if (toggleSelectCtrl) {
			// Crtl Select
			const selectedSchedules = [ ...this.state.selectedSchedules ];
			const indexes = [ ...this.state.scheduleIndexes ];

			if (selectedSchedules.length === 0 || !contains(selectedSchedules, data[index], 'from', 'order')) {
				selectedSchedules.push(data[index]);
				indexes.push(index);
				this.setState({ selectedSchedules, scheduleIndexes: indexes });
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

				this.setState({ selectedSchedules, scheduleIndexes: indexes });
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
				this.setState({ selectedSchedules: [ data[index] ], scheduleIndexes: [ index ] }, () =>
					console.log(this.state.selectedSchedules)
				);
			} else {
				// If selected schedule is the same as oncoming schedule, deselect everything, it's ok b/c single select contains only one schedule.
				this.setState({ selectedSchedules: [], scheduleIndexes: [] }, () =>
					console.log(this.state.selectedSchedules)
				);
			}
		}
	};

	_renderTables = () => {
		const columns = [
			{
				id: 'fromTime',
				Header: 'From',
				accessor: (d: Schedule) => d.from.time
			},
			{
				id: 'toTime',
				Header: 'To',
				accessor: (d: Schedule) => d.to.time
			}
		];
		const { schedules, onAddHours } = this.props;
		const { selectedSchedules, currentDay } = this.state;
		return schedules.map((dataSch, i) => {
			return (
				<div key={i}>
					<h4 style={{ marginRight: 30 }}>{workDays[i]}</h4>
					<div onClick={onAddHours(i)}>
						<ReactTable
							className={styles.scheduleTable}
							data={dataSch}
							columns={columns}
							pageSize={dataSch.length < 4 ? 4: dataSch.length}
							showPagination={false}
							sortable={false}
							NoDataComponent={() => null}
							getTrProps={(_: any, rowInfo: any) => {
								if (rowInfo && rowInfo.row) {
									const schedule = rowInfo.original as Schedule;
									return {
										onClick: this.selectSchedules(schedule, i),
										style: {
											background:
												currentDay === i &&
												contains(selectedSchedules, schedule, 'from', 'order')
													? 'rgba(22, 96, 27, 0.7)'
													: 'none',
											color:
												currentDay === i &&
												contains(selectedSchedules, schedule, 'from', 'order')
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
		});
	};

	render() {
		return <div className={styles.scheduleTables}>{this._renderTables()}</div>;
	}
}

export default DayTables;
