// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { DeleteSubjectProps } from './props';
import { Subject } from 'config';

// Common & additional component(s)
import { Button } from 'components/common';

// Action(s)
import { deleteSubject } from 'redux/store/subject/action';

const deleteFunc = (
	deleteSubject: (id: string, subjects: Subject[]) => void,
	subject: Subject | null,
	subjects: Subject[]
) => () => {
	if (subject) {
		deleteSubject(subject.id, subjects);
	}
};

const DeleteSubject: React.SFC<DeleteSubjectProps> = (props) => {
	const { deleteSubject, selected, data } = props;
	return (
		<Button
			disabled={props.selected === null}
			label="Delete"
			onClick={deleteFunc(deleteSubject, selected, data)}
		/>
	);
};

const mapStateToProps = (state: any) => ({
	selected: state.subject.data.selectedSubject,
	data: state.subject.data.subjects
});

export default connect(mapStateToProps, { deleteSubject })(DeleteSubject);
