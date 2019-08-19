import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { Button } from 'components/common';
import { contains } from 'utils/functions';
import { fetchAllSubjects, fetchAllSubjectsByTutors, clearStore } from 'redux/store/subject/action';
import styles from './styles.module.css';

const ipcRenderer = (window as any).ipcRenderer;

class ReportSubjectTable extends React.PureComponent<any, any> {
	state = { selected: [] };

	componentDidMount() {
		if (this.props.withCheckbox) {
			this.props.fetchAllSubjectsByTutors();
		} else this.props.fetchAllSubjects();
	}

	componentWillUnmount() {
		this.props.clearStore();
	}

	toggleRow = (data: any) => () => {
		const selected = [ ...this.state.selected ] as any[];
		let results: any[];
		if (selected.filter((subject: any) => subject.id === data.id).length) {
			results = selected.filter((subject: any) => subject.id !== data.id);
		} else {
			selected.push(data);
			results = selected;
		}

		this.setState({ selected: results }, () => console.log(this.state.selected));
	};

	toggleSelectAll = () => {
		let selected: any[];
		if (this.state.selected.length !== this.props.subjects.length) {
			selected = [ ...this.props.subjects ];
		} else selected = [];

		this.setState({ selected }, () => console.log(this.state.selected));
	};

	openReportScreen = (event: any) => () => {
		let sending: any[];
		if (this.props.withCheckbox) {
			sending = this.state.selected;
		} else {
			sending = this.props.subjects;
		}
		ipcRenderer.send(event, sending);
	};

	render() {
		let columns: any[];
		if (this.props.withCheckbox) {
			columns = [
				{
					id: 'checkbox',
					accessor: '',
					Cell: ({ original }: any) => {
						return (
							<input
								type="checkbox"
								className="checkbox"
								style={{ cursor: 'pointer', position: 'relative', bottom: 3.5, left: 1 }}
								checked={contains(this.state.selected, original, 'id')}
								onChange={this.toggleRow(original)}
							/>
						);
					},
					Header: (x: any) => {
						return (
							<input
								type="checkbox"
								className="checkbox"
								style={{ cursor: 'pointer', position: 'relative', bottom: 3.5, right: 1 }}
								checked={
									this.state.selected.length === this.props.subjects.length &&
									this.state.selected.length !== 0
								}
								onChange={this.toggleSelectAll}
							/>
						);
					},
					sortable: false,
					width: 40,
					height: 20,
					resizable: false
				},
				{
					Header: 'ID',
					id: 'id',
					height: 20,
					accessor: 'label'
				},
				{
					Header: 'Name',
					id: 'name',
					accessor: 'full'
				}
			];
		} else {
			columns = [
				{
					Header: 'ID',
					accessor: 'label'
				},
				{
					Header: 'Name',
					accessor: 'full'
				}
			];
		}
		console.log(this.props.subjects);
		return (
			<div className={styles.container}>
				<ReactTable
					className="report-table"
					style={{ height: 470, width: 420 }}
					columns={columns}
					data={this.props.subjects}
					pageSize={this.props.subjects.length < 13 ? 13 : this.props.subjects.length}
					showPagination={false}
				/>
				<div style={{ marginTop: 12 }}>
					<Button label="Show report" onClick={this.openReportScreen(this.props.screenEvent)} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	subjects: state.subject.data.subjects
});

export default connect(mapStateToProps, { fetchAllSubjects, fetchAllSubjectsByTutors, clearStore })(ReportSubjectTable);
