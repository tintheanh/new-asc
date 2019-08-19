import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SignIn, Admin } from './components/screens';
import { Tutors, Students, Subjects } from './components/screens/Admin/MainControl/UserPanel';
import { ViewAndCancelAppointment } from './components/screens/Admin/MainControl/AppoinmentPanel';
import { TutorReport, SubjectReport, AppointmentReport } from './components/screens/Admin/MainControl/ReportPanel';
import Report, {
	TutorWorkTrackReportScreen,
	TutorScheduleReportScreen,
	TutorSubjectReportScreen,
	TutorInfoReportScreen,
	SubjectListReportScreen,
	SubjectByTutorReportScreen,
	AppointmentByTutorReportScreen,
	AppointmentByStudentReportScreen
} from './components/screens/Reports';
import { AppointmentOptions, EmailOptions } from './components/screens/Admin/MainControl/SettingPanel';
import configureStore from './redux/configureStore';

class App extends React.Component {
	private configureStore: any;

	constructor(props: any) {
		super(props);

		this.configureStore = configureStore();
	}

	render() {
		return (
			<Provider store={this.configureStore.store}>
				<PersistGate loading={null} persistor={this.configureStore.persistor}>
					{/* One route for each screen */}
					<HashRouter>
						<Switch>
							<Route exact path="/" component={SignIn} />
							<Route exact path="/admin" component={Admin} />

							<Route exact path="/admin/tutors" component={Tutors} />
							<Route exact path="/admin/students" component={Students} />
							<Route exact path="/admin/subjects" component={Subjects} />
							<Route exact path="/admin/appointments" component={ViewAndCancelAppointment} />

							<Route exact path="/admin/report/tutors" component={TutorReport} />
							<Route exact path="/admin/report/subjects" component={SubjectReport} />
							<Route exact path="/admin/report/appointments" component={AppointmentReport} />

							<Route exact path="/admin/setting/appointment" component={AppointmentOptions} />
							<Route exact path="/admin/setting/email" component={EmailOptions} />

							<Route
								path="/tutor-work-report"
								component={() => <Report component={<TutorWorkTrackReportScreen />} />}
							/>
							<Route
								exact
								path="/tutor-schedule-report"
								component={() => <Report component={<TutorScheduleReportScreen />} />}
							/>
							<Route
								exact
								path="/tutor-subject-report"
								component={() => <Report component={<TutorSubjectReportScreen />} />}
							/>
							<Route
								exact
								path="/tutor-info-report"
								component={() => <Report component={<TutorInfoReportScreen />} />}
							/>
							<Route
								exact
								path="/subject-list-report"
								component={() => <Report component={<SubjectListReportScreen />} />}
							/>
							<Route
								exact
								path="/subject-by-tutor-report"
								component={() => <Report component={<SubjectByTutorReportScreen />} />}
							/>
							<Route
								exact
								path="/appointment-by-tutor-report"
								component={() => <Report component={<AppointmentByTutorReportScreen />} />}
							/>
							<Route
								exact
								path="/appointment-by-student-report"
								component={() => <Report component={<AppointmentByStudentReportScreen />} />}
							/>
						</Switch>
					</HashRouter>
				</PersistGate>
			</Provider>
		);
	}
}

export default App;
