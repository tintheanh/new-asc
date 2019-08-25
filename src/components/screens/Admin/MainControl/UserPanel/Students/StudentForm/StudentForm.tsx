// Dependencies
import * as React from "react";
import { connect } from "react-redux";

// Props/State types & additional type(s)
import { StudentFormProps, StudentFormStates } from "./props";

// Common & additional component(s)
import { InputField, Button, Checkbox } from "components/common";

// Action(s)
import {
  resetStudent,
  updateStudent,
  selectAndUpdateStudent,
  toggleAddStudent,
  addStudent
} from "redux/store/student/action";
import styles from "./styles.module.css";

class StudentForm extends React.Component<StudentFormProps, StudentFormStates> {
  state = { edit: false };

  componentDidUpdate(prevProps: any) {
    if (prevProps.selected && this.props.selected) {
      if (this.props.selected.uid !== prevProps.selected.uid && this.state.edit)
        this.setState({ edit: false });
      if (
        this.props.selected.uid &&
        this.props.selected !== prevProps.selected &&
        this.props.toggleAdd
      ) {
        this.props.toggleAddStudent(false);
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
          this.props.resetStudent(uid, data);
        }
      });
    }
  };

  setInfo = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.selected) {
      const student = {
        ...this.props.selected,
        [key]: key === "active" ? e.target.checked : e.target.value
      };
      this.props.selectAndUpdateStudent(student);
    }
  };

  _activateInput = () => {
    const { edit } = this.state;
    const { toggleAdd } = this.props;
    if (!edit && toggleAdd) return false;
    if (edit && !toggleAdd) return false;
    return true;
  };

  toggleAdd = (on: boolean) => () => {
    this.props.toggleAddStudent(on);
    if (on) this.setState({ edit: false });
  };

  handleUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    if (this.state.edit && this.props.selected) {
      const { selected, data } = this.props;
      this.props
        .updateStudent(selected, data)
        .then(() => this.setState({ edit: false }))
        .catch((err: any) => alert(err.message));
    }
  };

  handleAddStudent = (event: React.FormEvent) => {
    event.preventDefault();
    if (this.props.selected) {
      const { addStudent, selected, data, toggleAddStudent } = this.props;
      addStudent(selected, data)
        .then(() => toggleAddStudent(false))
        .catch((err: Error) => alert(err.message));
    }
  };

  render() {
    const { selected, toggleAdd } = this.props;
    const { edit } = this.state;
    return (
      <form className={`box-form ${styles.container}`}>
        <div className={styles.idAndEmailInput}>
          <InputField
            type="number"
            disabled={this._activateInput()}
            label="ID"
            value={selected ? selected.studentId : ""}
            onTextChange={this.setInfo("studentId")}
          />
          <InputField
            type="text"
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
        {!edit ? (
          <div>
            <Button
              customClassName={styles.editBtn}
              disabled={selected === null || toggleAdd}
              label="Edit"
              onClick={this.toggleEdit("edit")}
            />
          </div>
        ) : (
          <div className={styles.saveAndCancelBtn}>
            <Button type="submit" label="Save" onClick={this.handleUpdate} />
            <Button label="Cancel" onClick={this.toggleEdit("cancel")} />
          </div>
        )}
        {!toggleAdd ? (
          <Button
            customClassName={styles.newBtn}
            label="New"
            onClick={this.toggleAdd(true)}
          />
        ) : (
          <div className={styles.saveAndCancelBtn}>
            <Button
              type="submit"
              label="Save"
              onClick={this.handleAddStudent}
            />
            <Button label="Cancel" onClick={this.toggleAdd(false)} />
          </div>
        )}
      </form>
    );
  }
}

const mapStateToProps = (state: any) => ({
  data: state.student.data.students,
  selected: state.student.data.selectedStudent,
  toggleAdd: state.student.data.toggleAdd
});

export default connect(
  mapStateToProps,
  {
    resetStudent,
    updateStudent,
    selectAndUpdateStudent,
    toggleAddStudent,
    addStudent
  }
)(StudentForm);
