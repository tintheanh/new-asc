import * as React from 'react';
import { connect } from 'react-redux';
import TutorInfoReport from './TutorReportOption/TutorInfoReport/TutorInfoReport';

class ReportMainControl extends React.Component<any, any> {
	render() {
		const { reportOption } = this.props;

		switch (reportOption) {
			case 'Tutor Info':
				return <TutorInfoReport />;
			default:
				return null;
		}
	}
}

const mapStateToProps = (state: any) => ({
	reportOption: state.navigation.reportOption
});

export default connect(mapStateToProps, null)(ReportMainControl);
