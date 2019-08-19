import * as React from 'react';
import { connect } from 'react-redux';
import { Button, DatePicker } from 'components/common';
import { selectAndUpdateTutor } from 'redux/store/tutor/action';
import ReactTable from 'react-table';
import styles from './styles.module.css';

class EditOffTimes extends React.Component<any, any> {
	state = { from: null, to: null };
	processData = () => {
		return this.props.selected.off_time.map((time: any) => ({
			from: {
				timeString: new Date(time.from * 1000).toLocaleDateString('en-US'),
				unixTime: time.from
			},
			to: {
				timeString: new Date(time.to * 1000).toLocaleDateString('en-US'),
				unixTime: time.to
			}
		}));
	};

	setDateFrom = (date: Date) => this.setState({ from: date });

	setDateTo = (date: Date) => this.setState({ to: date });

	addOffTime = () => {
		if (this.state.from && this.state.to) {
			const off_time = [ ...this.props.selected.off_time ];

			const from = this.state.from! as Date;
			const to = this.state.to! as Date;

			const timeSet = {
				from: Math.floor(from.setHours(0, 0, 0) / 1000),
				to: Math.floor(to.setHours(0, 0, 0) / 1000)
			};

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

			console.log(sorted);

			// let filtered: any[] = [];
			// if (new Set(sorted.map((sch) => sch.from)).size === sorted.length) {
			// 	filtered = Array.from(new Set(sorted.map((sch) => sch.to))).map((to) =>
			// 		sorted.find((sch) => sch.to === to)
			// 	);
			// } else {
			// 	filtered = Array.from(new Set(sorted.map((sch) => sch.from))).map((from) =>
			// 		sorted.find((sch) => sch.from === from)
			// 	);
			// }

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
			this.setState({ from: null, to: null });
		}
	};

	render() {
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
		console.log(this.processData());
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
						/>
					</div>
					<div>
						<div className={styles.dateInputWrapper}>
							<p className={styles.label}>From:</p>
							<DatePicker
								className="form-control"
								selected={from}
								onChange={this.setDateFrom}
								maxDate={to}
								todayButton="Select today"
							/>
						</div>
						<div className={styles.dateInputWrapper}>
							<p className={styles.label}>To:</p>
							<DatePicker
								className="form-control"
								selected={to}
								onChange={this.setDateTo}
								minDate={from}
								todayButton="Select today"
							/>
						</div>
						<div className={styles.btnWrapper}>
							<Button
								disabled={this.state.from === null || this.state.to === null}
								label="Add"
								onClick={this.addOffTime}
							/>
							<Button label="Delete" />
						</div>
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

export default connect(mapStateToProps, { selectAndUpdateTutor })(EditOffTimes);
