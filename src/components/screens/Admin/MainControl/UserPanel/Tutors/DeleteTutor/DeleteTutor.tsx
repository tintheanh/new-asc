// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { DeleteTutorProps } from './props';
import { Tutor } from 'config';

// Common & additional component(s)
import { Button } from 'components/common';

// Action(s)
import { deleteTutor } from 'redux/store/tutor/action';

const deleteFunc = (
	deleteTutor: (uid: string, tutors: Tutor[]) => void,
	tutor: Tutor | null,
	tutors: Tutor[]
) => () => {
	if (tutor) {
		if (window.confirm(`Sure to delete ${tutor.first_name} ${tutor.last_name} ?`)) deleteTutor(tutor.uid, tutors);
	}
};

const DeleteTutor: React.SFC<DeleteTutorProps> = (props) => {
	const { deleteTutor, selected, data } = props;
	return (
		<Button disabled={props.selected === null} label="Delete" onClick={deleteFunc(deleteTutor, selected, data)} />
	);
};

const mapStateToProps = (state: any) => ({
	selected: state.tutor.data.selectedTutor,
	data: state.tutor.data.tutors
});

export default connect(mapStateToProps, { deleteTutor })(DeleteTutor);
