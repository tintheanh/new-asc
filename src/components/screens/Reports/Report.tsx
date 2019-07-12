import * as React from 'react';
import ReactToPrint from 'react-to-print';

interface ReportProps {
	component: JSX.Element
}

class Report extends React.Component<ReportProps, any> {
	private componentRef: React.RefObject<HTMLDivElement> = React.createRef();
	render() {
		return (
			<div>
				<ReactToPrint
					trigger={() => <button>Print this out!</button>}
					content={() => this.componentRef.current as HTMLInputElement}
				/>
				<div ref={this.componentRef} >
					{this.props.component}
				</div>
			</div>
		);
	}
}

export default Report;
