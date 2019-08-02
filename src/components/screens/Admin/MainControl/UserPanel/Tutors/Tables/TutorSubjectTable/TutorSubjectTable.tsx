// Dependencies
import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { TutorSubjectTableProps, TutorSubjectTableStates } from './props';

// Common & additional component(s)
import { Button, Modal } from 'components/common';
import { EditTutorSubjectTable } from '../';

// Action(s)
import { resetTutor } from 'redux/store/tutor/action';

class TutorSubjectTable extends React.Component<TutorSubjectTableProps, TutorSubjectTableStates> {
	state = { modalSubject: false };

	handleModalChange = () => {
		return {
			open: () => this.setState({ modalSubject: true }),
			close: () =>
				this.setState({ modalSubject: false }, () => {
					if (this.props.selected) {
						const { uid } = this.props.selected;
						const { data } = this.props;
						this.props.resetTutor(uid, data);
					}
				}),
			closeAfterSave: () => this.setState({ modalSubject: false })
		};
	};

	render() {
		const columns = [
			{
				Header: 'Subject ID',
				accessor: 'label'
			},
			{
				Header: 'Subject Name',
				accessor: 'full'
			}
		];
		const { selected, toggleAdd } = this.props;
		const { modalSubject } = this.state;
		const expandFull = { width: '100%', height: '100%' };
		return (
			<div style={expandFull}>
				<ReactTable
					style={expandFull}
					data={selected ? selected.subjects : []}
					columns={columns}
					showPagination={false}
					NoDataComponent={() => null}
					defaultSorted={[
						{
							id: 'label',
							desc: false
						}
					]}
				/>
				<Button
					disabled={selected === null || toggleAdd}
					label="Edit subjects"
					onClick={this.handleModalChange().open}
				/>
				<Modal width="70%" show={modalSubject} close={this.handleModalChange().close}>
					<EditTutorSubjectTable close={this.handleModalChange().closeAfterSave} />
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	data: state.tutor.data.tutors,
	selected: state.tutor.data.selectedTutor,
	toggleAdd: state.tutor.data.toggleAdd
});

export default connect(mapStateToProps, { resetTutor })(TutorSubjectTable);
