import * as React from 'react';
import ReactTable from 'react-table';
import { TutorTableProps } from './props';

const TutorTable: React.SFC<TutorTableProps> = (props) => {
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
	const { tutors, selectTutor, selected } = props;
	return (
		<ReactTable
			style={{ width: '100%', height: '100%' }}
			data={tutors}
			columns={columns}
			showPagination={false}
			defaultSorted={[
				{
					id: 'fist_name',
					desc: true
				},
				{
					id: 'last_name',
					desc: true
				}
			]}
			getTrProps={(_: any, rowInfo: any) => {
				if (rowInfo && rowInfo.row) {
					if (selected) {
						return {
							onClick: () => selectTutor(rowInfo),
							style: {
								background: rowInfo.original.uid === selected.uid ? '#00afec' : 'none',
								color: rowInfo.original.uid === selected.uid ? 'white' : 'black'
							}
						};
					}
					return {
						onClick: () => selectTutor(rowInfo)
					};
				} else {
					return {};
				}
			}}
		/>
	);
};

export default TutorTable;
