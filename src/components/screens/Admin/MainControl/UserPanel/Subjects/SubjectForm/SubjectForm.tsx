// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { SubjectFormProps, SubjectFormStates } from './props';

// Common & additional component(s)
import { InputField, Button } from 'components/common';

// Action(s)
import {
	selectAndUpdateSubject,
	toggleAddSubject,
	updateSubject,
	addSubject,
	resetSubject
} from 'redux/store/subject/action';
import styles from './styles.module.css';

class SubjectForm extends React.Component<SubjectFormProps, SubjectFormStates> {
	state = { edit: false };

	componentDidUpdate(prevProps: SubjectFormProps) {
		if (prevProps.selected && this.props.selected) {
			if (this.props.selected.id !== prevProps.selected.id && this.state.edit) this.setState({ edit: false });
			if (this.props.selected.id && this.props.selected !== prevProps.selected && this.props.toggleAdd) {
				this.props.toggleAddSubject(false);
			}
		}
	}

	setInfo = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
		if (this.props.selected) {
			const subject = {
				...this.props.selected,
				[key]: key === 'active' ? e.target.checked : e.target.value
			};
			this.props.selectAndUpdateSubject(subject);
		}
	};

	toggleEdit = (type: 'edit' | 'cancel') => () => {
		if (type === 'edit') {
			this.setState({ edit: true });
		} else {
			this.setState({ edit: false }, () => {
				if (this.props.selected) {
					const { id } = this.props.selected;
					const { data } = this.props;
					this.props.resetSubject(id, data);
				}
			});
		}
	};

	toggleAdd = (on: boolean) => () => {
		this.props.toggleAddSubject(on);
		if (on) this.setState({ edit: false });
	};

	handleUpdate = (event: React.FormEvent) => {
		event.preventDefault();
		if (this.state.edit && this.props.selected) {
			const { selected, data } = this.props;
			this.props
				.updateSubject(selected, data)
				.then(() => this.setState({ edit: false }))
				.catch((err: any) => alert(err.message));
		}
	};

	handleAddStudent = (event: React.FormEvent) => {
		event.preventDefault();
		if (this.props.selected) {
			const { addSubject, selected, data, toggleAddSubject } = this.props;
			addSubject(selected, data).then(() => toggleAddSubject(false)).catch((err) => alert(err.message));
		}
	};

	_activateInput = () => {
		const { edit } = this.state;
		const { toggleAdd } = this.props;
		if (!edit && toggleAdd) return false;
		if (edit && !toggleAdd) return false;
		return true;
	};

	render() {
		const { edit } = this.state;
		const { selected, toggleAdd } = this.props;
		return (
			<form className={`box-form ${styles.container}`}>
				<div className={styles.nameAndLabel}>
					<InputField
						type="text"
						disabled={this._activateInput()}
						label="Subject lable"
						value={selected ? selected.label : ''}
						onTextChange={this.setInfo('label')}
					/>
					<InputField
						type="text"
						disabled={this._activateInput()}
						label="Subject name"
						value={selected ? selected.full : ''}
						onTextChange={this.setInfo('full')}
					/>
				</div>
				{!edit ? (
					<div>
						<Button
							customClassName={styles.editBtn}
							disabled={selected === null || toggleAdd}
							label="Edit"
							onClick={this.toggleEdit('edit')}
						/>
					</div>
				) : (
					<div className={styles.saveAndCancelBtn}>
						<Button type="submit" label="Save" onClick={this.handleUpdate} />
						<Button label="Cancel" onClick={this.toggleEdit('cancel')} />
					</div>
				)}
				{!toggleAdd ? (
					<Button customClassName={styles.newBtn} label="New" onClick={this.toggleAdd(true)} />
				) : (
					<div className={styles.saveAndCancelBtn}>
						<Button type="submit" label="Save" onClick={this.handleAddStudent} />
						<Button label="Cancel" onClick={this.toggleAdd(false)} />
					</div>
				)}
			</form>
		);
	}
}

const mapStateToProps = (state: any) => ({
	data: state.subject.data.subjects,
	selected: state.subject.data.selectedSubject,
	toggleAdd: state.subject.data.toggleAdd
});

export default connect(mapStateToProps, {
	selectAndUpdateSubject,
	toggleAddSubject,
	updateSubject,
	addSubject,
	resetSubject
})(SubjectForm);
