// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';

// Props/State types & additional type(s)
import { SubjectTableProps } from './props';
import { Subject } from 'config';

// Action(s)
import { selectAndUpdateSubject } from 'redux/store/subject/action';

class SubjectTable extends React.Component<SubjectTableProps> {
	performSelectSubject = (subject: Subject) => () => this.props.selectAndUpdateSubject(subject);

	render() {
		const columns = [
			{
				Header: 'Subject ID',
				accessor: 'label'
			},
			{
				Header: 'Subject name',
				accessor: 'full'
			}
		];
		const { data, selected } = this.props;
		return (
			<div style={{ width: '100%', height: '100%' }}>
				<ReactTable
					style={{ width: '100%', height: '100%' }}
					columns={columns}
					showPagination={false}
					data={data}
					pageSize={data.length < 13 ? 13 : data.length}
					// defaultSorted={[
					// 	{
					// 		id: 'label',
					// 		desc: false
					// 	}
					// ]}
					getTrProps={(_: any, rowInfo: any) => {
						if (rowInfo && rowInfo.row) {
							const subject = rowInfo.original as Subject;
							if (selected) {
								return {
									onClick: this.performSelectSubject(subject),
									style: {
										background: rowInfo.original.id === selected.id ? '#00afec' : 'none',
										color: rowInfo.original.id === selected.id ? 'white' : 'black'
									}
								};
							}
							return {
								onClick: this.performSelectSubject(subject)
							};
						} else {
							return {};
						}
					}}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	data: state.subject.data.subjects,
	selected: state.subject.data.selectedSubject
});

export default connect(mapStateToProps, { selectAndUpdateSubject })(SubjectTable);
