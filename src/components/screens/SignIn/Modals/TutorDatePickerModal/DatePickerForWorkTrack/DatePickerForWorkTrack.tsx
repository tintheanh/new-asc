import * as React from 'react';
import { connect } from 'react-redux';
import { DatePicker } from 'components/common';
import { getEpochOfTime } from 'utils/functions';
import { DatePickerProps, DatePickerStates } from './props';

const ipcRenderer = (window as any).ipcRenderer;

class DatePickerForWorkTrack extends React.Component<DatePickerProps, DatePickerStates> {
	constructor(props: DatePickerProps) {
		super(props);
		this.state = { from: new Date(), to: new Date() };
	}
	
	handleTimeChange = (key: string) => (date: Date) => this.setState({ [key]: date });

	showReport = (): void => {
		// From time needs to be at 00:00
		this.state.from.setHours(0, 0, 0, 0);

		const sending = {
			range: {
				from: getEpochOfTime(this.state.from),
				to: getEpochOfTime(this.state.to)
			},
			tutors: [ this.props.data ]
		};

		ipcRenderer.send('toggle-work-report', sending);
	};

	render() {
		const { from, to } = this.state;
		return (
			<div>
				<p>From</p>
				<DatePicker
					selected={this.state.from}
					onChange={this.handleTimeChange('from')}
					todayButton={'Select Today'}
					maxDate={new Date()}
				/>
				<p>To</p>
				<DatePicker
					selected={this.state.to}
					onChange={this.handleTimeChange('to')}
					todayButton={'Select Today'}
					maxDate={new Date()}
				/>
				{from > to ? (
					<button disabled>Wrong time</button>
				) : (
					<button onClick={this.showReport}>Show report</button>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	data: state.tutor.data.tutor,
	error: state.tutor.error
});

export default connect(mapStateToProps, null)(DatePickerForWorkTrack);
