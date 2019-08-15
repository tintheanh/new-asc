import * as React from 'react';
import ReactToPrint from 'react-to-print';
import print from 'components/common/print.png';

interface ReportProps {
	component: JSX.Element;
}

class Report extends React.Component<ReportProps, any> {
	private componentRef: React.RefObject<HTMLDivElement> = React.createRef();
	render() {
		return (
			<div>
				<ReactToPrint
					trigger={() => (
						<div
							style={{
								position: 'fixed',
								zIndex: 1000,
								top: 12,
								left: 12,
								backgroundColor: 'white',
								opacity: 0.7,
								cursor: 'pointer',
								width: 40,
								borderRadius: '40px',
								padding: `5px 2px`,
								textAlign: 'center',
								boxShadow: `0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)`
							}}
						>
							<img src={print} alt="" width="30" />
						</div>
					)}
					content={() => this.componentRef.current as HTMLInputElement}
				/>
				<div ref={this.componentRef}>{this.props.component}</div>
			</div>
		);
	}
}

export default Report;
