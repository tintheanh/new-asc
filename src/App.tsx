import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SignIn, Admin } from './components/screens';
import { Tutors, Students, Subjects } from './components/screens/Admin/MainControl/UserPanel';
import Report, { TutorWorkTrackReport, TutorScheduleReport, TutorSubjectReport } from './components/screens/Reports';
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
							<Route
								path="/tutor-work-report"
								component={() => <Report component={<TutorWorkTrackReport />} />}
							/>
							<Route
								exact
								path="/tutor-schedule-report"
								component={() => <Report component={<TutorScheduleReport />} />}
							/>
							<Route
								exact
								path="/tutor-subject-report"
								component={() => <Report component={<TutorSubjectReport />} />}
							/>
						</Switch>
					</HashRouter>
				</PersistGate>
			</Provider>
		);
	}
}

export default App;
