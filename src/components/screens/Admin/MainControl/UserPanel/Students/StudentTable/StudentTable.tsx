// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

// Props/State types & additional type(s)
import { StudentTableProps, StudentTableStates } from './props';
import { Student } from 'config';

// Common & additional component(s)
import { Checkbox } from 'components/common';

// Action(s)
import { selectAndUpdateStudent } from 'redux/store/student/action';

class StudentTable extends React.Component<StudentTableProps, StudentTableStates> {
	state = { hideInactive: false };

	setInactive = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ hideInactive: event.target.checked });
	};

	performSelectStudent = (student: Student) => () => this.props.selectAndUpdateStudent(student);

	_processStudentArray = () => {
		if (this.state.hideInactive) {
			return this.props.data.filter((student) => student.active);
		}
		return this.props.data;
	};
	render() {
		const columns = [
			{
				id: 'name',
				Header: 'Student name',
				accessor: (d: { first_name: string; last_name: string; active: boolean }) =>
					`${d.first_name}, ${d.last_name}`
			},
			{
				Header: 'Student ID',
				accessor: 'studentId'
			},
			{
				id: 'active',
				Header: 'Active',
				accessor: (d: { active: boolean }) => (d.active ? 'Yes' : 'No')
			}
		];
		const { selected } = this.props;
		return (
			<div style={{ width: '100%', height: '100%' }}>
				<ReactTable
					style={{ width: '100%', height: '100%' }}
					data={this._processStudentArray()}
					columns={columns}
					showPagination={false}
					getTrProps={(_: any, rowInfo: any) => {
						if (rowInfo && rowInfo.row) {
							const student = rowInfo.original as Student;
							if (selected) {
								return {
									onClick: this.performSelectStudent(student),
									style: {
										background: rowInfo.original.uid === selected.uid ? '#00afec' : 'none',
										color: rowInfo.original.uid === selected.uid ? 'white' : 'black'
									}
								};
							}
							return {
								onClick: this.performSelectStudent(student)
							};
						} else {
							return {};
						}
					}}
				/>
				<Checkbox
					checked={this.state.hideInactive}
					onChange={this.setInactive}
					labelText="Hide inactive students"
				/>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	data: state.student.data.students,
	selected: state.student.data.selectedStudent
});

export default connect(mapStateToProps, { selectAndUpdateStudent })(StudentTable);
