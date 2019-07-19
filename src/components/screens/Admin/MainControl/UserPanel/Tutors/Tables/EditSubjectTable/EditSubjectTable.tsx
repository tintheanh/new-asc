import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';

import { EditSubjectTableProps, EditSubjectTableStates } from './props';

import { Button } from 'components/common';

import { Subject } from 'redux/store/subject/types';

import { contains } from 'utils/functions';

import { fetchAllSubjects } from 'redux/store/subject/actions';

import styles from './styles.module.css';

class EditSubjectTable extends React.Component<EditSubjectTableProps, EditSubjectTableStates> {
	private handleKeyDown: any;
	private handleKeyUp: any;
	constructor(props: EditSubjectTableProps) {
		super(props);
		this.state = {
			toggleSelectMultiple: false,
			toggleSelectShift: false,
			subjects: [],
			removedSubjects: [],
			addedSubjects: [],
			removedSubjectIndexes: [],
			addedSubjectIndexes: []
		};

		// Bind in constructor for cancelling subscriptions when unmount
		// If bind in removeEventListener, this shit will create new references everytime => won't cancelling
		this.handleKeyDown = this.handleOnKey('down').bind(this);
		this.handleKeyUp = this.handleOnKey('up').bind(this);
	}

	static getDerivedStateFromProps(props: any, state: any) {
		if (state.subjects !== props.subjects) {
			return { subjects: props.subjects };
		}
		return null;
	}

	preprocessSubjects = () => {
		return this.state.subjects.filter((sj) => !contains(this.props.tutorSubjects, sj, 'id'));
	};

	componentDidMount() {
		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);

		this.props.fetchAllSubjects();
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown);
		document.removeEventListener('keyup', this.handleKeyUp);
	}

	handleOnKey = (behavior: 'up' | 'down') => (e: React.KeyboardEvent) => {
		if (e.keyCode === 91 || e.keyCode === 93)
			this.setState({ toggleSelectMultiple: behavior === 'down' ? true : false, toggleSelectShift: false });
		if (e.keyCode === 16)
			this.setState({ toggleSelectShift: behavior === 'down' ? true : false, toggleSelectMultiple: false });
	};

	selectSubjects(key: string, indexKey: string, subject: Subject) {
		const { subjects, toggleSelectMultiple, toggleSelectShift } = this.state;
		const index = subjects.findIndex((sj) => sj.id === subject.id);

		if (key === 'addedSubjects') this.setState({ removedSubjects: [] });
		else this.setState({ addedSubjects: [] });

		if (toggleSelectMultiple) {
			// Crtl Select
			const selectedSubjects = [ ...this.state[key] ];
			const indexes = [ ...this.state[indexKey] ];

			if (selectedSubjects.length === 0 || !contains(selectedSubjects, subjects[index], 'id')) {
				selectedSubjects.push(subjects[index]);
				indexes.push(index);
				this.setState({ [key]: selectedSubjects, [indexKey]: indexes });
			} else {
				// If selectedSubjects contains oncoming subject, deselect it.
				const newSelectedSubjects = selectedSubjects.filter((sj) => sj.id !== subjects[index].id);
				const newIndexes = indexes.filter((i) => i !== index);
				this.setState({ [key]: newSelectedSubjects, [indexKey]: newIndexes });
			}
		} else if (toggleSelectShift) {
			// Shift Select
			const selectedSubjects = [ ...this.state[key] ];
			const indexes = [ ...this.state[indexKey] ];
			if (selectedSubjects.length === 0 || !contains(selectedSubjects, subjects[index], 'id')) {
				// Appropriate Ascending/Descending Sort to deselecting subject(s)
				if (index > indexes[indexes.length - 1]) {
					indexes.push(index);
					indexes.sort((a, b) => a - b);
					for (let i = indexes[0]; i <= indexes[indexes.length - 1]; i += 1) {
						if (!contains(selectedSubjects, subjects[i], 'id')) selectedSubjects.push(subjects[i]);
					}
				} else {
					indexes.push(index);
					indexes.sort((a, b) => b - a);
					for (let i = indexes[0]; i >= indexes[indexes.length - 1]; i -= 1) {
						if (!contains(selectedSubjects, subjects[i], 'id')) selectedSubjects.push(subjects[i]);
					}
				}

				this.setState({ [key]: selectedSubjects, [indexKey]: indexes });
			} else {
				selectedSubjects.length = 0;
				let newIndexes;
				if (indexes[0] < indexes[indexes.length - 1]) {
					// Deselecting upward
					newIndexes = indexes.filter((i) => i < index);
					newIndexes.push(index);
					for (let i = newIndexes[0]; i <= newIndexes[newIndexes.length - 1]; i += 1) {
						selectedSubjects.push(subjects[i]);
					}
				} else {
					// Deselecting downward
					newIndexes = indexes.filter((i) => i > index);
					newIndexes.push(index);

					for (let i = newIndexes[0]; i >= newIndexes[newIndexes.length - 1]; i -= 1) {
						selectedSubjects.push(subjects[i]);
					}
				}
				this.setState({ [key]: selectedSubjects, [indexKey]: newIndexes });
			}
		} else {
			// Single Select
			if (this.state[key].length === 0 || this.state[key][0].id !== subjects[index].id) {
				this.setState({ [key]: [ subjects[index] ], [indexKey]: [ index ] });
			} else {
				// If selected subject is the same as oncoming subject, deselect everything, it's ok b/c single select contains only one subject.
				this.setState({ [key]: [], [indexKey]: [] });
			}
		}
	}

	onSending = (type: 'add' | 'remove') => {
		if (type === 'add') {
			this.props.onUpdate(this.state.addedSubjects, type);
			this.setState({ addedSubjects: [], addedSubjectIndexes: [] });
		} else {
			this.props.onUpdate(this.state.removedSubjects, type);
			this.setState({ removedSubjects: [], removedSubjectIndexes: [] });
		}
	};

	onSendingDoubleClick = (type: 'add' | 'remove', subject: Subject) => {
		this.props.onUpdate([ subject ], type);
		if (type === 'add') {
			this.setState({ addedSubjects: [], addedSubjectIndexes: [] });
		} else {
			this.setState({ removedSubjects: [], removedSubjectIndexes: [] });
		}
	};

	render() {
		// console.log(this.state.selectedSubjects);
		// console.log(this.props.tutorSubjects);
		if (this.state.subjects.length && this.props.tutorSubjects) {
			const { removedSubjects, addedSubjects } = this.state;

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

			return (
				<div className={styles.container}>
					<ReactTable
						className={styles.table}
						data={this.props.tutorSubjects}
						columns={columns}
						showPagination={false}
						sortable={false}
						NoDataComponent={() => null}
						defaultSorted={[
							{
								id: 'label',
								desc: false
							}
						]}
						getTrProps={(_: any, rowInfo: any) => {
							if (rowInfo && rowInfo.row) {
								const subject = rowInfo.original as Subject;
								return {
									onClick: this.selectSubjects.bind(
										this,
										'removedSubjects',
										'removedSubjectIndexes',
										subject
									),
									onDoubleClick: this.onSendingDoubleClick.bind(this, 'remove', subject),
									style: {
										background: contains(removedSubjects, subject, 'id') ? '#00afec' : 'none',
										color: contains(removedSubjects, subject, 'id') ? 'white' : 'black'
									}
								};
							} else {
								return {};
							}
						}}
					/>
					<Button
						disabled={addedSubjects.length === 0}
						label="Up"
						onClick={this.onSending.bind(this, 'add')}
					/>
					<Button
						disabled={removedSubjects.length === 0}
						label="Down"
						onClick={this.onSending.bind(this, 'remove')}
					/>
					<ReactTable
						className={styles.table}
						data={this.preprocessSubjects()}
						columns={columns}
						showPagination={false}
						sortable={false}
						NoDataComponent={() => null}
						defaultSorted={[
							{
								id: 'label',
								desc: false
							}
						]}
						getTrProps={(_: any, rowInfo: any) => {
							if (rowInfo && rowInfo.row) {
								const subject = rowInfo.original as Subject;
								return {
									onClick: this.selectSubjects.bind(
										this,
										'addedSubjects',
										'addedSubjectIndexes',
										subject
									),
									onDoubleClick: this.onSendingDoubleClick.bind(this, 'add', subject),
									style: {
										background: contains(addedSubjects, subject, 'id') ? '#00afec' : 'none',
										color: contains(addedSubjects, subject, 'id') ? 'white' : 'black'
									}
								};
							} else {
								return {};
							}
						}}
					/>
					<div onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} tabIndex={0} />
				</div>
			);
		}
		return <h1>Loading</h1>;
	}
}

const mapStateToProps = (state: any) => ({
	subjects: state.subject.subjects
});

export default connect(mapStateToProps, { fetchAllSubjects })(EditSubjectTable);
