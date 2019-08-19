// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

// Props/State types & additional type(s)
import { TutorTableProps, TutorTableStates } from './props';
import { Tutor } from 'config';

// Common & additional component(s)
import { Checkbox } from 'components/common';

// Action(s)
import { selectAndUpdateTutor } from 'redux/store/tutor/action';

class TutorTable extends React.Component<TutorTableProps, TutorTableStates> {
	state = { hideInactive: false };

	setInactive = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ hideInactive: event.target.checked });
	};

	performSelectTutor = (tutor: Tutor) => () => this.props.selectAndUpdateTutor(tutor);

	_processTutorArray = () => {
		if (this.state.hideInactive) {
			return this.props.data.filter((tutor) => tutor.active);
		}
		return this.props.data;
	};

	render() {
		console.log(this.props.data);
		const columns = [
			{
				Header: 'First Name',
				accessor: 'first_name'
			},
			{
				Header: 'Last Name',
				accessor: 'last_name'
			},
			{
				id: 'active',
				Header: 'Active',
				accessor: (d: { active: boolean }) => (d.active ? 'Yes' : 'No')
			}
		];
		const { selected } = this.props;
		const expandFull = { width: '100%', height: '100%' };
		return (
			<div style={expandFull}>
				<ReactTable
					style={expandFull}
					data={this._processTutorArray()}
					columns={columns}
					showPagination={false}
					pageSize={this._processTutorArray().length < 8 ? 8 : this._processTutorArray().length}
					// defaultSorted={[
					// 	{
					// 		id: 'fist_name',
					// 		desc: true
					// 	},
					// 	{
					// 		id: 'last_name',
					// 		desc: true
					// 	}
					// ]}
					getTrProps={(_: any, rowInfo: any) => {
						if (rowInfo && rowInfo.row) {
							const tutor = rowInfo.original as Tutor;
							if (selected) {
								return {
									onClick: this.performSelectTutor(tutor),
									style: {
										background: rowInfo.original.uid === selected.uid ? '#00afec' : 'none',
										color: rowInfo.original.uid === selected.uid ? 'white' : 'black'
									}
								};
							}
							return {
								onClick: this.performSelectTutor(tutor)
							};
						} else {
							return {};
						}
					}}
				/>
				<div style={{ marginTop: 12 }}>
					<Checkbox
						checked={this.state.hideInactive}
						onChange={this.setInactive}
						labelText="Hide inactive tutors"
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	selected: state.tutor.data.selectedTutor,
	data: state.tutor.data.tutors
});

export default connect(mapStateToProps, { selectAndUpdateTutor })(TutorTable);
