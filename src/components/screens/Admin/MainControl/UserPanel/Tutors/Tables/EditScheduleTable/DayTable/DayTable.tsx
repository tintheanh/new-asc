import * as React from 'react';
import ReactTable from 'react-table';
import { contains } from 'utils/functions';
import styles from './styles.module.css';

class DayTable extends React.Component<any, any> {
	private handleKeyDown: any;
	private handleKeyUp: any;
	constructor(props: any) {
		super(props);
		this.state = {
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

	shouldComponentUpdate(nextProps: any, nextState: any) {
		if (this.props.data !== nextProps.data) return true;
		if (this.state.selectedSchedules !== nextState.selectedSchedules) return true;
		if (this.props.isPickingTime === nextProps.isPickingTime) return false;
		if (this.state.selectedSchedules.length === 0 && nextState.selectedSchedules.length === 0) return false;
		return true;
	}

	componentDidUpdate(prevProps: any) {
		const { selectedSchedules } = this.state;
		if (selectedSchedules.length && this.props.isPickingTime !== prevProps.isPickingTime) {
			this.setState({ selectedSchedules: [], scheduleIndexes: [] });
		}
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
		if (e.keyCode === 8 && behavior === 'down' && this.state.selectedSchedules.length) {
			this.props.onDeleteSchedules(this.props.day.index, this.state.selectedSchedules);
		}
	};

	selectSchedules(schedule: any) {
		const { toggleSelectCtrl, toggleSelectShift } = this.state;
		const { data } = this.props;
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

	render() {
		const columns = [
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
		];
		const { data, day, onAddHours } = this.props;
		const { selectedSchedules } = this.state;
		return (
			<div>
				<h4>{day.dayOfWeek}</h4>
				<div onClick={onAddHours}>
					<ReactTable
						className={styles.scheduleTable}
						data={data}
						columns={columns}
						showPagination={false}
						sortable={false}
						NoDataComponent={() => null}
						getTrProps={(_: any, rowInfo: any) => {
							if (rowInfo && rowInfo.row) {
								const schedule = rowInfo.original;
								return {
									onClick: this.selectSchedules.bind(this, schedule),
									style: {
										background: contains(selectedSchedules, schedule, 'from', 'order')
											? '#00afec'
											: 'none',
										color: contains(selectedSchedules, schedule, 'from', 'order')
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
	}
}

export default DayTable;
