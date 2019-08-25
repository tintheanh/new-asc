import * as React from "react";
import { connect } from "react-redux";
import { TutorFormProps, TutorFormStates } from "./props";

import { InputField, Button, Checkbox } from "components/common";

import {
  selectAndUpdateTutor,
  updateTutor,
  resetTutor,
  toggleAddTutor,
  addTutor
} from "redux/store/tutor/action";
import styles from "./styles.module.css";

class TutorForm extends React.Component<TutorFormProps, TutorFormStates> {
  constructor(props: TutorFormProps) {
    super(props);
    this.state = {
      edit: false
    };
  }

  componentDidUpdate(prevProps: TutorFormProps) {
    if (prevProps.selected && this.props.selected) {
      if (this.props.selected.uid !== prevProps.selected.uid && this.state.edit)
        this.setState({ edit: false });
      if (
        this.props.selected.uid &&
        this.props.selected !== prevProps.selected &&
        this.props.toggleAdd
      ) {
        this.props.toggleAddTutor(false);
      }
    }
  }

  toggleEdit = (type: "edit" | "cancel") => (event: React.FormEvent) => {
    event.preventDefault();
    if (type === "edit") {
      this.setState({ edit: true });
    } else {
      this.setState({ edit: false }, () => {
        if (this.props.selected) {
          const { uid } = this.props.selected;
          const { data } = this.props;
          this.props.resetTutor(uid, data);
        }
      });
    }
  };

  toggleAdd = (on: boolean) => () => {
    this.props.toggleAddTutor(on);
    if (on) this.setState({ edit: false });
  };

  setInfo = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.selected) {
      const tutor = {
        ...this.props.selected,
        [key]: key === "active" ? e.target.checked : e.target.value
      };
      this.props.selectAndUpdateTutor(tutor);
    }
  };

  handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    if (this.state.edit && this.props.selected) {
      const { selected, data } = this.props;
      this.props
        .updateTutor(selected, data)
        .then(() => this.setState({ edit: false }))
        .catch(err => alert(err.message));
    }
  };

  handleAddTutor = (event: React.FormEvent) => {
    event.preventDefault();
    if (this.props.selected) {
      const { addTutor, selected, data, toggleAddTutor } = this.props;
      addTutor(selected, data)
        .then(() => toggleAddTutor(false))
        .catch(err => alert(err.message));
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
    // console.log(selected);
    return (
      <form className={`box-form ${styles.container}`}>
        <div className={styles.idAndEmailInput}>
          <InputField
            type="number"
            disabled={this._activateInput()}
            label="ID"
            value={selected ? selected.staff_id : ""}
            onTextChange={this.setInfo("staff_id")}
          />
          <InputField
            type="email"
            disabled={this._activateInput()}
            label="Email"
            value={selected ? selected.email : ""}
            onTextChange={this.setInfo("email")}
          />
        </div>
        <div className={styles.firstLastNameInput}>
          <InputField
            type="text"
            disabled={this._activateInput()}
            label="First name"
            value={selected ? selected.first_name : ""}
            onTextChange={this.setInfo("first_name")}
          />
          <InputField
            type="text"
            disabled={this._activateInput()}
            label="Last name"
            value={selected ? selected.last_name : ""}
            onTextChange={this.setInfo("last_name")}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <Checkbox
            disabled={this._activateInput()}
            checked={selected ? selected.active : false}
            labelText="Active"
            onChange={this.setInfo("active")}
          />
        </div>

        <div className={styles.btnGroup}>
          {!edit ? (
            <Button
              customClassName={styles.editBtn}
              disabled={selected === null || toggleAdd}
              label="Edit"
              onClick={this.toggleEdit("edit")}
            />
          ) : (
            <div className={styles.saveAndCancelBtn}>
              <Button type="submit" label="Save" onClick={this.handleUpdate} />
              <Button label="Cancel" onClick={this.toggleEdit("cancel")} />
            </div>
          )}
          <div>
            {!toggleAdd ? (
              <Button
                customClassName={styles.newBtn}
                label="New"
                onClick={this.toggleAdd(true)}
              />
            ) : (
              <div
                className={styles.saveAndCancelBtn}
                style={{ marginTop: 10 }}
              >
                <Button
                  type="submit"
                  label="Save"
                  onClick={this.handleAddTutor}
                />
                <Button label="Cancel" onClick={this.toggleAdd(false)} />
              </div>
            )}
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state: any) => ({
  data: state.tutor.data.tutors,
  selected: state.tutor.data.selectedTutor,
  toggleAdd: state.tutor.data.toggleAdd
});

export default connect(
  mapStateToProps,
  { selectAndUpdateTutor, updateTutor, resetTutor, toggleAddTutor, addTutor }
)(TutorForm);
