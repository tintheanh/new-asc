// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { DeleteStudentProps } from './props';
import { Student } from 'config';

// Common & additional component(s)
import { Button } from 'components/common';

// Action(s)
import { deleteStudent } from 'redux/store/student/action';

const deleteFunc = (
	deleteStudent: (uid: string, students: Student[]) => void,
	student: Student | null,
	students: Student[]
) => () => {
	if (student) {
		if (window.confirm(`Sure to delete ${student.first_name} ${student.last_name} ?`))
			deleteStudent(student.uid, students);
	}
};

const DeleteStudent: React.SFC<DeleteStudentProps> = (props) => {
	const { deleteStudent, selected, data } = props;
	return (
		<Button disabled={props.selected === null} label="Delete" onClick={deleteFunc(deleteStudent, selected, data)} />
	);
};

const mapStateToProps = (state: any) => ({
	selected: state.student.data.selectedStudent,
	data: state.student.data.students
});

export default connect(mapStateToProps, { deleteStudent })(DeleteStudent);
