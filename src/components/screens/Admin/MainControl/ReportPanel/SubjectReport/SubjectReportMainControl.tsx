import * as React from 'react';
import { connect } from 'react-redux';
import SubjectListReport from './SubjectReportOption/SubjectListReport/SubjectListReport';
import SubjectByTutorReport from './SubjectReportOption/SubjectByTutorReport/SubjectByTutorReport';

class SubjectReportMainControl extends React.Component<any, any> {
	render() {
		const { subjectReportOption } = this.props;

		switch (subjectReportOption) {
			case 'Subject List':
				return <SubjectListReport />;
			case 'Subject By Tutor':
				return <SubjectByTutorReport />;
			default:
				return null;
		}
	}
}

const mapStateToProps = (state: any) => ({
	subjectReportOption: state.navigation.subjectReportOption
});

export default connect(mapStateToProps, null)(SubjectReportMainControl);
