// Dependencies
import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { TutorsProps, TutorsStates } from './props';
import { Tutor } from 'redux/store/tutor/types';
import { Subject } from 'redux/store/subject/types';

// Common & additional component(s)
import { Header, Checkbox, Modal, Button } from 'components/common';
import { TutorTable, TutorSubjectTable, EditSubjectTable, ScheduleTable } from './Tables';
import TutorForm from './TutorForm/TutorForm';

// Utils
import { contains } from 'utils/functions';

// Action(s)
import { fetchAllTutors, updateTutor } from 'redux/store/tutor/actions';

// Styles
import styles from './styles.module.css';

class Tutors extends React.Component<TutorsProps, TutorsStates> {
	constructor(props: TutorsProps) {
		super(props);
		this.state = {
			tutorIndex: 0,
			selected: null,
			hideInactive: false,
			edit: false,
			modalSubject: false,
			modalSchedule: false
		};
	}

	componentDidMount() {
		this.props.fetchAllTutors();
	}

	handleStateChange = () => {
		return {
			hideInactive: (event: React.ChangeEvent<HTMLInputElement>) =>
				this.setState({ hideInactive: event.target.checked, selected: null }),
			toggleEdit: () => {
				if (this.state.selected) this.setState({ edit: true });
			},
			toggleCancel: () => {
				const index = this.state.tutorIndex;
				this.setState({ edit: false, selected: this.props.data[index] });
			},
			selectTutor: (rowInfo: any) => {
				this.setState({
					tutorIndex: rowInfo.index,
					selected: rowInfo.original as Tutor,
					edit: false
				});
			},
			tutorChange: () => {
				const updateBasicInfo = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
					const tutor = {
						...this.state.selected,
						[key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
					} as Tutor;
					this.setState({ selected: tutor });
				};

				const updateSubject = (subjects: Subject[], type: 'add' | 'remove') => {
					const { selected } = this.state;
					if (selected) {
						switch (type) {
							case 'add': {
								const existingSubjects = [ ...selected.subjects ];
								for (const subject of subjects) {
									if (!contains(existingSubjects, subject, 'id')) existingSubjects.push(subject);
								}
								const tutor = { ...selected, subjects: existingSubjects };
								this.setState({ selected: tutor });
								break;
							}
							case 'remove': {
								const newSubjects = selected.subjects.filter((sj) => !contains(subjects, sj, 'id'));
								const tutor = { ...selected, subjects: newSubjects };
								this.setState({ selected: tutor });
								break;
							}
							default:
								break;
						}
					}
				};

				return { updateBasicInfo, updateSubject };
			},
			handleModalChange: (key: string) => {
				return {
					open: () => this.setState({ [key]: true }),
					close: () => this.setState({ [key]: false })
				};
			}
		};
	};

	handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (this.state.edit) {
			const update = { ...this.state.selected } as Tutor;
			this.props
				.updateTutor(update)
				.then(() => this.setState({ edit: false }, () => this.props.fetchAllTutors()))
				.catch((err) => alert(err.message));
		}
	};

	processTutorArray = () => {
		if (this.state.hideInactive) {
			return this.props.data.filter((tutor) => tutor.active);
		}
		return this.props.data;
	};

	render() {
		// console.log(this.props.data);
		if (this.props.data) {
			const { selected, edit, modalSubject, modalSchedule } = this.state;
			return (
				<div>
					<Header title="Tutors" />
					<Link className={styles.backBtn} to="/admin">
						Back
					</Link>
					<div className={styles.tableContainer}>
						<div className={styles.tutorTable}>
							<TutorTable
								tutors={this.processTutorArray()}
								selected={selected}
								selectTutor={this.handleStateChange().selectTutor}
							/>
							<Checkbox
								checked={this.state.hideInactive}
								onChange={this.handleStateChange().hideInactive}
								labelText="Hide inactive tutors"
							/>
						</div>
						<div className={styles.subjectTable}>
							<TutorSubjectTable selected={selected} />
							<Button
								disabled={!edit}
								label="Edit subjects"
								onClick={this.handleStateChange().handleModalChange('modalSubject').open}
							/>
						</div>
					</div>
					<div>
						<TutorForm
							disable={!edit}
							selected={selected}
							toggleEdit={this.handleStateChange().toggleEdit}
							toggleCancel={this.handleStateChange().toggleCancel}
							onTextChange={this.handleStateChange().tutorChange()}
							handleSubmit={this.handleSubmit}
						/>
						<Button
							disabled={!edit}
							label="Edit schedule"
							onClick={this.handleStateChange().handleModalChange('modalSchedule').open}
						/>
					</div>
					<Modal
						width="70%"
						show={modalSubject}
						close={this.handleStateChange().handleModalChange('modalSubject').close}
					>
						<EditSubjectTable
							tutorSubjects={selected ? selected.subjects : null}
							onUpdate={this.handleStateChange().tutorChange().updateSubject}
						/>
					</Modal>
					<Modal
						width="70%"
						show={modalSchedule}
						close={this.handleStateChange().handleModalChange('modalSchedule').close}
					>
						<ScheduleTable />
					</Modal>
				</div>
			);
		}
		return <h1>Loading</h1>;
	}
}

const mapStateToProps = (state: any) => ({
	data: state.tutor.data.tutors
});

export default connect(mapStateToProps, { fetchAllTutors, updateTutor })(Tutors);
