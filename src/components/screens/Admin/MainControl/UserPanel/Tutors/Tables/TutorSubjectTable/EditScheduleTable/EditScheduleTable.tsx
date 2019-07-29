// Dependencies
import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { EditScheduleTableProps, EditScheduleTableStates } from './props';
import { Time, Schedule } from 'config';

// Common & additional component(s)
import DayTables from './DayTables/DayTables';
import { data } from 'config/contants';
import { Button } from 'components/common';

// Util(s)
import { contains, arraySort } from 'utils/functions';

// Action(s)
import { selectAndUpdateTutor, updateTutor } from 'redux/store/tutor/actions';

// Styles
import styles from './styles.module.css';

class EditScheduleTable extends React.Component<EditScheduleTableProps, EditScheduleTableStates> {
	private handleKeyDown: any;
	private handleKeyUp: any;
	constructor(props: EditScheduleTableProps) {
		super(props);
		this.state = {
			selectedTime: [],
			selectedHours: null,
			timeIndexes: [],
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

	handleOnKey = (behavior: 'up' | 'down') => (e: React.KeyboardEvent) => {
		if (e.keyCode === 91 || e.keyCode === 93)
			this.setState({ toggleSelectCtrl: behavior === 'down' ? true : false, toggleSelectShift: false });
		if (e.keyCode === 16)
			this.setState({ toggleSelectShift: behavior === 'down' ? true : false, toggleSelectCtrl: false });
	};

	selectTimes = (hour: Time) => () => {
		const index = data.findIndex((hr) => hr.order === hour.order);
		const { toggleSelectShift, selectedTime } = this.state;

		const setHours = (time: Time[]) => {
			const sorted = arraySort(time, 'order');
			const hours = {
				from: {
					time: sorted[0].time,
					order: sorted[0].order
				},
				to: {
					time: sorted[sorted.length - 1].time,
					order: sorted[sorted.length - 1].order
				}
			};
			this.setState({ selectedHours: hours });
		};

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
				this.setState({ selectedTime: selected, timeIndexes }, () => setHours(this.state.selectedTime));
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
					setHours(this.state.selectedTime)
				);
			}
		} else {
			if (selectedTime.length === 0 || selectedTime[0].time !== data[index].time || selectedTime.length > 2) {
				this.setState(
					{
						selectedTime:
							index === data.length - 1
								? [ data[index - 1], data[index] ]
								: [ data[index], data[index + 1] ],
						timeIndexes: index === data.length - 1 ? [ index - 1, index ] : [ index, index + 1 ]
					},
					() => setHours(this.state.selectedTime)
				);
			} else {
				this.setState({ selectedTime: [], timeIndexes: [], selectedHours: null });
			}
		}
	};

	onAddHours = (dayOfWeek: number) => () => {
		const work_schedule = [ ...this.props.selected!.work_schedule ];
		const { selectedHours } = this.state;

		const isOverlapped = (time1: Schedule, time2: Schedule) => {
			if (
				(time1.from.order < time2.from.order && time1.to.order < time2.from.order) ||
				(time1.from.order > time2.to.order && time1.to.order > time2.to.order)
			) {
				return false;
			}
			return true;
		};

		if (selectedHours) {
			let countOverlapped = 0;
			const processedHours = work_schedule[dayOfWeek].map((hours) => {
				if (isOverlapped(selectedHours, hours)) {
					countOverlapped += 1;
					if (selectedHours.from.order >= hours.from.order && selectedHours.to.order <= hours.to.order)
						return hours;
					if (selectedHours.from.order <= hours.from.order && selectedHours.to.order <= hours.to.order)
						return {
							from: {
								time: selectedHours.from.time,
								order: selectedHours.from.order
							},
							to: {
								time: hours.to.time,
								order: hours.to.order
							}
						};
					if (selectedHours.from.order >= hours.from.order && selectedHours.to.order >= hours.to.order)
						return {
							from: {
								time: hours.from.time,
								order: hours.from.order
							},
							to: {
								time: selectedHours.to.time,
								order: selectedHours.to.order
							}
						};
					if (selectedHours.from.order < hours.from.order && selectedHours.to.order > hours.to.order)
						return selectedHours;
				}
				return hours;
			});
			if (countOverlapped === 0) processedHours.push(selectedHours);

			const sorted = processedHours.sort(
				(a, b) => (a.from.order > b.from.order ? 1 : b.from.order > a.from.order ? -1 : 0)
			);

			// Check duplicates
			const filtered = Array.from(new Set(sorted.map((sch) => sch.from.order))).map((order) =>
				sorted.find((sch) => sch.from.order === order)
			);

			work_schedule[dayOfWeek] = filtered as Schedule[];

			const tutor = { ...this.props.selected!, work_schedule: work_schedule as [Schedule[]] };

			this.props.selectAndUpdateTutor(tutor);

			this.setState({ selectedHours: null, selectedTime: [] });
		}
	};

	onDeleteSchedules = (day: number, schedules: Schedule[]) => {
		const work_schedule = [ ...this.props.selected!.work_schedule ];
		const newWorkSchedule = work_schedule[day].filter((sch) => !contains(schedules, sch, 'from', 'order'));
		work_schedule[day] = newWorkSchedule;
		const tutor = { ...this.props.selected!, work_schedule: work_schedule as [Schedule[]] };
		this.props.selectAndUpdateTutor(tutor);
	};

	handleUpdate = () => {
		if (this.props.selected) {
			const { selected, data, close } = this.props;
			this.props.updateTutor(selected, data).then(() => close()).catch((err) => alert(err.message));
		}
	};

	_renderTables = () => {
		const columns = {
			hourPickingColumns: [
				{
					Header: 'Hours',
					accessor: 'time'
				}
			]
		};
		if (this.props.selected) {
			const { selectedTime, toggleSelectCtrl, toggleSelectShift } = this.state;
			const { selected } = this.props;
			return (
				<div>
					<h1>{selected.first_name}</h1>
					<div className={styles.tableContainer}>
						<ReactTable
							className={styles.hourPickingTable}
							defaultPageSize={25}
							data={data}
							columns={columns.hourPickingColumns}
							showPagination={false}
							sortable={false}
							getTrProps={(_: any, rowInfo: any) => {
								if (rowInfo && rowInfo.row) {
									const hour = rowInfo.original as Time;
									return {
										onClick: this.selectTimes(hour),
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
						<DayTables
							schedules={selected.work_schedule}
							onAddHours={this.onAddHours}
							toggleSelectCtrl={toggleSelectCtrl}
							toggleSelectShift={toggleSelectShift}
							isPickingTime={selectedTime.length !== 0}
							onDeleteSchedules={this.onDeleteSchedules}
						/>
						<Button label="Save" onClick={this.handleUpdate} />
					</div>
				</div>
			);
		}
		return null;
	};

	render() {
		return this._renderTables();
	}
}

const mapStateToProps = (state: any) => ({
	selected: state.tutor.data.selectedTutor,
	data: state.tutor.data.tutors
});

export default connect(mapStateToProps, { selectAndUpdateTutor, updateTutor })(EditScheduleTable);
