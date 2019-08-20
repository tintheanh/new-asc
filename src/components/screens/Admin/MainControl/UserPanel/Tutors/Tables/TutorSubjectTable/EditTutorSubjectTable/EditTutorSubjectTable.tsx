// Dependencies
import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { EditTutorSubjectTableProps, EditTutorSubjectTableStates } from './props';
import { Subject } from 'config';

// Common & additional component(s)
import { Button } from 'components/common';

// Util(s)
import { contains } from 'utils/functions';

// Action(s)
import { fetchAllSubjects } from 'redux/store/subject/action';
import { selectAndUpdateTutor, updateTutor } from 'redux/store/tutor/action';

// Styles
import styles from './styles.module.css';

class EditTutorSubjectTable extends React.Component<EditTutorSubjectTableProps, EditTutorSubjectTableStates> {
	private handleKeyDown: any;
	private handleKeyUp: any;
	constructor(props: EditTutorSubjectTableProps) {
		super(props);
		this.state = {
			toggleSelectCtrl: false,
			toggleSelectShift: false,
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
			this.setState({ toggleSelectCtrl: behavior === 'down' ? true : false, toggleSelectShift: false });
		if (e.keyCode === 16)
			this.setState({ toggleSelectShift: behavior === 'down' ? true : false, toggleSelectCtrl: false });
	};

	selectSubjects = (key: string, indexKey: string, subject: Subject) => () => {
		const { toggleSelectCtrl, toggleSelectShift } = this.state;
		const { subjects } = this.props;
		const index = subjects.findIndex((sj: any) => sj.id === subject.id);

		if (key === 'addedSubjects') this.setState({ removedSubjects: [] });
		else this.setState({ addedSubjects: [] });

		if (toggleSelectCtrl) {
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
	};

	onSending = (type: 'add' | 'remove') => () => {
		if (type === 'add') {
			this.setSubjects(this.state.addedSubjects, type);
			this.setState({ addedSubjects: [], addedSubjectIndexes: [] });
		} else {
			this.setSubjects(this.state.removedSubjects, type);
			this.setState({ removedSubjects: [], removedSubjectIndexes: [] });
		}
	};

	onSendingDoubleClick = (type: 'add' | 'remove', subject: Subject) => () => {
		this.setSubjects([ subject ], type);
		if (type === 'add') {
			this.setState({ addedSubjects: [], addedSubjectIndexes: [] });
		} else {
			this.setState({ removedSubjects: [], removedSubjectIndexes: [] });
		}
	};

	setSubjects = (subjects: Subject[], type: 'add' | 'remove') => {
		const { selected } = this.props;
		if (selected) {
			switch (type) {
				case 'add': {
					const existingSubjects = [ ...selected.subjects ];
					for (const subject of subjects) {
						if (!contains(existingSubjects, subject, 'id')) existingSubjects.push(subject);
					}
					const tutor = { ...selected, subjects: existingSubjects };
					// const index = this.props.data.findIndex(tt => tt.uid === tutor.uid);

					this.props.selectAndUpdateTutor(tutor);
					break;
				}
				case 'remove': {
					const newSubjects = selected.subjects.filter((sj: Subject) => !contains(subjects, sj, 'id'));
					const tutor = { ...selected, subjects: newSubjects };
					this.props.selectAndUpdateTutor(tutor);
					break;
				}
				default:
					break;
			}
		}
	};

	_preprocessSubjects = () => {
		return this.props.subjects.filter((sj) => !contains(this.props.selected.subjects, sj, 'id'));
	};

	handleUpdate = () => {
		if (this.props.selected) {
			const { selected, data, close } = this.props;
			this.props.updateTutor(selected, data).then(() => close()).catch((err) => alert(err.message));
		}
	};

	render() {
		// console.log(this.props.data);
		if (this.props.subjects.length && this.props.selected) {
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
					<h3 className={styles.title}>
						{this.props.selected.first_name} {this.props.selected.last_name}'s subjects
					</h3>
					<ReactTable
						className={styles.table}
						data={this.props.selected.subjects}
						pageSize={this.props.selected.subjects.length < 6 ? 6 : this.props.selected.subjects.length}
						columns={columns}
						showPagination={false}
						sortable={false}
						NoDataComponent={() => null}
						// defaultSorted={[
						// 	{
						// 		id: 'label',
						// 		desc: false
						// 	}
						// ]}
						getTrProps={(_: any, rowInfo: any) => {
							if (rowInfo && rowInfo.row) {
								const subject = rowInfo.original as Subject;
								return {
									onClick: this.selectSubjects('removedSubjects', 'removedSubjectIndexes', subject),
									onDoubleClick: this.onSendingDoubleClick('remove', subject),
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
					<div className={styles.upDownBtnGroup}>
						<Button disabled={addedSubjects.length === 0} label="&#8593;" onClick={this.onSending('add')} />
						<Button
							disabled={removedSubjects.length === 0}
							label="&#8595;"
							onClick={this.onSending('remove')}
						/>
					</div>
					<h3 className={styles.title}>Center's subjects</h3>
					<ReactTable
						className={styles.table}
						data={this._preprocessSubjects()}
						pageSize={this._preprocessSubjects().length < 6 ? 6 : this._preprocessSubjects().length}
						columns={columns}
						showPagination={false}
						sortable={false}
						NoDataComponent={() => null}
						// defaultSorted={[
						// 	{
						// 		id: 'label',
						// 		desc: false
						// 	}
						// ]}
						getTrProps={(_: any, rowInfo: any) => {
							if (rowInfo && rowInfo.row) {
								const subject = rowInfo.original as Subject;
								return {
									onClick: this.selectSubjects('addedSubjects', 'addedSubjectIndexes', subject),
									onDoubleClick: this.onSendingDoubleClick('add', subject),
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
					<Button customClassName={styles.saveBtn} label="Save" onClick={this.handleUpdate} />
				</div>
			);
		}
		return <h1>Loading</h1>;
	}
}

const mapStateToProps = (state: any) => ({
	data: state.tutor.data.tutors,
	subjects: state.subject.data.subjects,
	selected: state.tutor.data.selectedTutor
});

export default connect(mapStateToProps, { selectAndUpdateTutor, fetchAllSubjects, updateTutor })(EditTutorSubjectTable);
