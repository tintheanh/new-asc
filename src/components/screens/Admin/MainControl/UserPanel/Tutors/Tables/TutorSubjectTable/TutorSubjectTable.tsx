import * as React from 'react';
import ReactTable from 'react-table';
import { TutorSubjectTableProps } from './props';

const TutorSubjectTable: React.SFC<TutorSubjectTableProps> = (props) => {
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
	const { selected } = props;
	const expandFull = { width: '100%', height: '100%' };
	return (
		<div style={expandFull}>
			<ReactTable
				style={expandFull}
				data={selected ? selected.subjects : []}
				columns={columns}
				showPagination={false}
				defaultSorted={[
					{
						id: 'label',
						desc: false
					}
				]}
			/>
		</div>
	);
};

export default TutorSubjectTable;
