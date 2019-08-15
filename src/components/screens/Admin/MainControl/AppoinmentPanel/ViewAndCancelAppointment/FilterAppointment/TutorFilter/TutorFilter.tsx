import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { fetchTutorsForFilter, setTutorFilter } from 'redux/store/appointment/action';

class TutorFilter extends React.Component<any, any> {
	componentDidMount() {
		this.props.fetchTutorsForFilter();
	}

	setTutor = (tutor: any) => this.props.setTutorFilter(tutor);

	render() {
		// console.log(this.props.tutors);
		return (
			<div style={{ marginTop: 10 }}>
				<Select
					placeholder="Select tutor..."
					options={this.props.tutors}
					onChange={this.setTutor}
					value={this.props.selectedTutor}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	tutors: state.appointment.data.filter.tutors,
	selectedTutor: state.appointment.data.filter.tutor
});

export default connect(mapStateToProps, { fetchTutorsForFilter, setTutorFilter })(TutorFilter);
