import * as React from 'react';
import { connect } from 'react-redux';
import { Button, DatePicker } from 'components/common';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { selectAndUpdateTutor, updateTutor } from 'redux/store/tutor/action';
import ReactTable from 'react-table';
import styles from './styles.module.css';

class EditOffTimes extends React.Component<any, any> {
	state = { from: null, to: null, fromTime: '12:00 AM', toTime: '12:00 AM', timeSelected: { from: 0, to: 0 } };
	processData = () => {
		return this.props.selected.off_time.map((time: any) => ({
			from: {
				timeString: moment.unix(time.from).format('MM/DD/YYYY, hh:mm A'),
				unixTime: time.from
			},
			to: {
				timeString: moment.unix(time.to).format('MM/DD/YYYY, hh:mm A'),
				unixTime: time.to
			}
		}));
	};

	setDateFrom = (date: Date) => this.setState({ from: date });

	setDateTo = (date: Date) => this.setState({ to: date });

	setTimeFrom = (time: any) => this.setState({ fromTime: time.format('hh:mm A') });

	setTimeTo = (time: any) => this.setState({ toTime: time.format('hh:mm A') });

	addOffTime = () => {
		if (this.state.from && this.state.to) {
			const off_time = [ ...this.props.selected.off_time ];

			const from = this.state.from! as Date;
			const to = this.state.to! as Date;

			const timeSet = {
				from: Number(
					moment(`${from.toLocaleDateString('en-US')} ${this.state.fromTime}`, 'M/D/YYYY hh:mm A').format('X')
				),
				to: Number(
					moment(`${to.toLocaleDateString('en-US')} ${this.state.toTime}`, 'M/D/YYYY hh:mm A').format('X')
				)
			};
			if (timeSet.from < timeSet.to) {
				console.log(timeSet);

				const isOverlapped = (time1: any, time2: any) => {
					if (
						(time1.from < time2.from && time1.to < time2.from) ||
						(time1.from > time2.to && time1.to > time2.to)
					) {
						return false;
					}
					return true;
				};

				let countOverlapped = 0;
				const processedTime = off_time.map((time) => {
					if (isOverlapped(timeSet, time)) {
						countOverlapped += 1;
						if (timeSet.from >= time.from && timeSet.to <= time.to) return time;
						if (timeSet.from <= time.from && timeSet.to <= time.to)
							return {
								from: timeSet.from,
								to: time.to
							};
						if (timeSet.from >= time.from && timeSet.to >= time.to)
							return {
								from: time.from,
								to: timeSet.to
							};
						if (timeSet.from < time.from && timeSet.to > time.to) return timeSet;
					}
					return time;
				});
				if (countOverlapped === 0) processedTime.push(timeSet);

				const sorted = processedTime.sort((a, b) => (a.from > b.from ? 1 : b.from > a.from ? -1 : 0));
				// console.log(sorted);

				const merges = [];
				let isMerged = false;
				for (let i = 0; i < sorted.length; i++) {
					if (isMerged) {
						isMerged = false;
						continue;
					}
					if (i !== sorted.length - 1) {
						if (sorted[i].to >= sorted[i + 1].from) {
							const merge = {
								from: sorted[i].from,
								to: sorted[i + 1].to
							};
							merges.push(merge);
							isMerged = true;
						} else {
							merges.push(sorted[i]);
						}
					} else {
						merges.push(sorted[i]);
					}
				}

				const finalOffTimes = merges;

				const tutor = { ...this.props.selected!, off_time: finalOffTimes };

				this.props.selectAndUpdateTutor(tutor);
				this.setState({ from: null, to: null, fromTime: '12:00 AM', toTime: '12:00 AM' });
			} else {
				alert('Invalid time.');
			}
		}
	};

	deleteOffTime = () => {
		const tutor = { ...this.props.selected };
		const newOffTimes = tutor.off_time.filter((time: any) => time.from !== this.state.timeSelected.from);
		tutor.off_time = newOffTimes;
		console.log(tutor);
		this.props.selectAndUpdateTutor(tutor);
	};

	selectTime = (time: any) => () => this.setState({ timeSelected: time });

	handleUpdate = () => {
		if (this.props.selected) {
			const { selected, data, close } = this.props;
			console.log(selected);
			this.props.updateTutor(selected, data, false).then(() => close()).catch((err: Error) => alert(err.message));
		}
	};

	render() {
		// console.log(this.props.selected.off_time);
		const columns = [
			{
				Header: 'From',
				id: 'from',
				accessor: (d: any) => d.from.timeString
			},
			{
				Header: 'To',
				id: 'to',
				accessor: (d: any) => d.to.timeString
			}
		];
		// console.log(this.processData());
		const { from, to } = this.state;
		return (
			<div>
				<h3>
					{this.props.selected.first_name} {this.props.selected.last_name}'s Off Times
				</h3>
				<div className={styles.container}>
					<div>
						<ReactTable
							style={{ height: 400 }}
							columns={columns}
							data={this.processData()}
							pageSize={this.processData().length < 11 ? 11 : this.processData().length}
							showPagination={false}
							getTrProps={(_: any, rowInfo: any) => {
								if (rowInfo && rowInfo.row) {
									const time = {
										from: rowInfo.original.from.unixTime,
										to: rowInfo.original.to.unixTime
									};
									if (this.state.timeSelected) {
										return {
											onClick: this.selectTime(time),
											style: {
												background:
													this.state.timeSelected.from === time.from ? '#00afec' : 'none',
												color: this.state.timeSelected.from === time.from ? 'white' : 'black'
											}
										};
									}

									return {
										onClick: this.selectTime(time)
									};
								} else {
									return {};
								}
							}}
						/>
					</div>
					<div>
						<div className={styles.dateInputWrapper}>
							<p className={styles.label}>From:</p>
							<DatePicker
								className={`form-control ${styles.dateInput}`}
								selected={from}
								placeholderText="Select date"
								onChange={this.setDateFrom}
								maxDate={to}
								todayButton="Select today"
							/>
							<TimePicker
								className={styles.timeInput}
								showSecond={false}
								format="hh:mm a"
								value={moment(this.state.fromTime, 'hh:mm A')}
								onChange={this.setTimeFrom}
								use12Hours
							/>
						</div>
						<div className={styles.dateInputWrapper}>
							<p className={styles.label}>To:</p>
							<DatePicker
								className={`form-control ${styles.dateInput}`}
								selected={to}
								placeholderText="Select date"
								onChange={this.setDateTo}
								minDate={from}
								todayButton="Select today"
							/>
							<TimePicker
								className={styles.timeInput}
								showSecond={false}
								format="hh:mm a"
								value={moment(this.state.toTime, 'hh:mm A')}
								onChange={this.setTimeTo}
								use12Hours
							/>
						</div>
						<div className={styles.btnWrapper}>
							<Button
								disabled={this.state.from === null || this.state.to === null}
								label="Add"
								onClick={this.addOffTime}
							/>
							<Button label="Delete" onClick={this.deleteOffTime} />
						</div>
						<Button customClassName={styles.saveBtn} label="Save" onClick={this.handleUpdate} />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	data: state.tutor.data.tutors,
	selected: state.tutor.data.selectedTutor
});

export default connect(mapStateToProps, { selectAndUpdateTutor, updateTutor })(EditOffTimes);
