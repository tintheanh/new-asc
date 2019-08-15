import * as React from 'react';
import { connect } from 'react-redux';
import { connectSearchBox, connectHits } from 'react-instantsearch-dom';
import { setStudentFilter } from 'redux/store/appointment/action';
import Select from 'react-select';

class SearchBox extends React.Component<any, any> {
	// performSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	this.props.refine(event.currentTarget.value);
	// 	this.props.searchStudent(event.currentTarget.value);
	// };

	selectStudent = (student: any) => this.props.setStudentFilter(student);

	render() {
		// console.log(this.props.hits);
		return (
			// <form role="search">
			// 	<input type="search" value={this.props.searchToken} onChange={this.performSearch} />
			// </form>
			<Select
				placeholder="Select student..."
				options={this.props.hits.map((hit: any) => ({
					value: hit.objectID,
					label: `${hit.first_name} ${hit.last_name}`
				}))}
				value={this.props.selectedStudent}
				onChange={this.selectStudent}
			/>
		);
	}
}

const mapStateToProps = (state: any) => ({
	searchToken: state.student.data.searchToken,
	selectedStudent: state.appointment.data.filter.student
});

const CustomSearchBox = connectSearchBox(connectHits(SearchBox));
export default connect(mapStateToProps, { setStudentFilter })(CustomSearchBox);
