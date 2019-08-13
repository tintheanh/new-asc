import * as React from 'react';
const dateOptions = {
	weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: 'numeric'
};
const timeOptions = {
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric'
};
class Clock extends React.Component<any, any> {
	private intervalID: number;
	constructor(props: any) {
		super(props);
		this.state = {
			time: new Date().toLocaleDateString('us-US', dateOptions) // For realtime clock
		};
		this.intervalID = 0;
	}

	componentDidMount() {
		// Clock ticking
		this.intervalID = window.setInterval(
			() =>
				this.setState({
					time: new Date().toLocaleTimeString('en-US', timeOptions)
				}),
			1000
		);
	}

	componentWillUnmount() {
		clearInterval(this.intervalID);
	}

	render() {
		const { time } = this.state;
		return (
			<div className="box-form" style={{ width: '50%', backgroundColor: '#fff' }}>
				<p style={{ paddingBottom: 6 }}>{new Date().toLocaleDateString('en-US', dateOptions)}</p>
				<p>{time}</p>
			</div>
		);
	}
}

export default Clock;
