import * as React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { fetchAllSubjects } from "redux/store/subject/action";
import { setSubjectFilter } from "redux/store/appointment/action";

class SubjectFilter extends React.Component<any, any> {
  componentWillMount() {
    this.props.fetchAllSubjects();
  }

  setSubject = (subject: any) => this.props.setSubjectFilter(subject);

  render() {
    // console.log(this.props.subjects);
    return (
      <div style={{ marginTop: 12 }}>
        <Select
          className="subjectFilter"
          placeholder="Select subject..."
          options={this.props.subjects.map((subject: any) => ({
            value: subject.id,
            label: subject.label
          }))}
          value={this.props.selectedSubject}
          onChange={this.setSubject}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  subjects: state.subject.data.subjects,
  selectedSubject: state.appointment.data.filter.subject
});

export default connect(
  mapStateToProps,
  { fetchAllSubjects, setSubjectFilter }
)(SubjectFilter);
