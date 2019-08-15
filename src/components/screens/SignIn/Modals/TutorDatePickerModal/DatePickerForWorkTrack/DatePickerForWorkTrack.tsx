import * as React from 'react';
import { connect } from 'react-redux';
import { DatePicker, Button } from 'components/common';
import { getEpochOfTime } from 'utils/functions';
import { DatePickerProps, DatePickerStates } from './props';
import styles from './styles.module.css';

const ipcRenderer = (window as any).ipcRenderer;

class DatePickerForWorkTrack extends React.Component<any, any> {
	constructor(props: any) {
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
		console.log('test')
		return (
			<div className={styles.formWrap}>
				<div className={styles.inputWrapper}>
					<p className={styles.labelInput}>From:</p>
					<DatePicker
						className={`form-control ${styles.input}`}
						selected={this.state.from}
						onChange={this.handleTimeChange('from')}
						todayButton={'Select Today'}
						maxDate={to}
					/>
				</div>
				<div>
					<p className={styles.labelInput}>To:</p>
					<DatePicker
						className={`form-control ${styles.input}`}
						selected={this.state.to}
						onChange={this.handleTimeChange('to')}
						todayButton={'Select Today'}
						minDate={from}
					/>
				</div>
				<Button customClassName={styles.btnShow} onClick={this.showReport} label="Show report" />
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	data: state.tutor.data.tutor
});

export default connect(mapStateToProps, null)(DatePickerForWorkTrack);
