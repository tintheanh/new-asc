import * as React from 'react';
import { connect } from 'react-redux';
import TutorSubjectReport from './TutorReportOption/TutorSubjectReport/TutorSubjectReport';
import TutorScheduleReport from './TutorReportOption/TutorScheduleReport/TutorScheduleReport';
import TutorInfoReport from './TutorReportOption/TutorInfoReport/TutorInfoReport';
import TutorWorkTrackReport from './TutorReportOption/TutorWorkTrackReport/TutorWorkTrackReport';

class TutorReportMainControl extends React.Component<any, any> {
	render() {
		const { tutorReportOption } = this.props;

		switch (tutorReportOption) {
			case 'Tutor Info':
				return <TutorInfoReport />;
			case 'Tutor Subject':
				return <TutorSubjectReport />;
			case 'Tutor Schedule':
				return <TutorScheduleReport />;
			case 'Tutor Hours Track':
				return <TutorWorkTrackReport />;
			default:
				return null;
		}
	}
}

const mapStateToProps = (state: any) => ({
	tutorReportOption: state.navigation.tutorReportOption
});

export default connect(mapStateToProps, null)(TutorReportMainControl);
