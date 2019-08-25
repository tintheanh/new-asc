import * as React from "react";
import ReactTable from "react-table";
import { connect } from "react-redux";
import { Checkbox, Button, DatePicker } from "components/common";
import { fetchAllTutors, clear } from "redux/store/tutor/action";
import { contains, arraySort, getEpochOfTime } from "utils/functions";
import styles from "./styles.module.css";

const ipcRenderer = (window as any).ipcRenderer;

// TODO: do performance improvement

class ReportTutorTable extends React.Component<any, any> {
  state = {
    selected: [],
    hideInactive: false,
    from: new Date(),
    to: new Date()
  };

  static defaultProps = {
    datepicker: false
  };

  componentDidMount() {
    this.props.fetchAllTutors();
  }

  componentWillUnmount() {
    this.props.clear();
  }

  // shouldComponentUpdate(nextProps: any, nextState: any) {
  // 	if (this.props.tutors !== nextProps.tutors) return true;
  // 	if (this.state.selected !== nextState.selected) return true;
  // 	return false;
  // }

  toggleRow = (data: any) => () => {
    const selected = [...this.state.selected] as any[];
    let results: any[];
    if (selected.filter((tutor: any) => tutor.uid === data.uid).length) {
      results = selected.filter((tutor: any) => tutor.uid !== data.uid);
    } else {
      selected.push(data);
      results = selected;
    }

    this.setState({ selected: results }, () =>
      console.log(this.state.selected)
    );
  };

  toggleSelectAll = () => {
    let selected: any[];
    if (this.state.selected.length !== this.props.tutors.length) {
      selected = [...this.props.tutors];
    } else selected = [];

    this.setState({ selected }, () => console.log(this.state.selected));
  };

  _processTutorArray = () => {
    if (this.state.hideInactive) {
      return this.props.tutors.filter((tutor: any) => tutor.active);
    }
    return this.props.tutors;
  };

  setInactive = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ hideInactive: event.target.checked }, () => {
      const selected = this.state.selected.filter((tutor: any) => tutor.active);
      this.setState({ selected });
    });
  };

  openReportScreen = (event: string) => () => {
    let sending: any;
    const sorted = arraySort(this.state.selected, "first_name");
    if (this.props.datepicker) {
      this.state.from.setHours(0, 0, 0, 0);
      sending = {
        range: {
          from: getEpochOfTime(this.state.from),
          to: getEpochOfTime(this.state.to)
        },
        tutors: sorted
      };
    } else {
      sending = sorted;
    }

    ipcRenderer.send(event, sending);
  };

  handleTimeChange = (key: string) => (date: Date) =>
    this.setState({ [key]: date });

  render() {
    const col = [
      {
        id: "checkbox",
        accessor: "",
        Cell: ({ original }: any) => {
          return (
            <input
              type="checkbox"
              className="checkbox"
              style={{
                cursor: "pointer",
                position: "relative",
                bottom: 3.5,
                left: 1
              }}
              checked={contains(this.state.selected, original, "uid")}
              onChange={this.toggleRow(original)}
            />
          );
        },
        Header: (x: any) => {
          return (
            <input
              type="checkbox"
              className="checkbox"
              style={{
                cursor: "pointer",
                position: "relative",
                bottom: 3.5,
                right: 0
              }}
              checked={
                this.state.selected.length === this.props.tutors.length &&
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
        Header: "Name",
        id: "name",
        height: 20,
        accessor: (d: any) => `${d.first_name} ${d.last_name}`
      },
      {
        Header: "Active",
        id: "active",
        accessor: (d: any) => (d.active ? "Yes" : "No")
      }
    ];
    const { from, to } = this.state;
    return (
      <div className={styles.container}>
        <div>
          <ReactTable
            className="report-table"
            style={{ height: 470, width: 320 }}
            data={this._processTutorArray()}
            pageSize={
              this._processTutorArray().length <= 12
                ? 12
                : this._processTutorArray().length
            }
            columns={col}
            defaultSorted={[{ id: "firstName", desc: false }]}
            showPagination={false}
          />
          <div style={{ marginTop: 12 }}>
            <Checkbox
              checked={this.state.hideInactive}
              onChange={this.setInactive}
              labelText="Hide inactive tutors"
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <Button
              label="Show report"
              onClick={this.openReportScreen(this.props.screenEvent)}
            />
          </div>
        </div>
        {this.props.datepicker ? (
          <div className={styles.formWrap}>
            <div className={styles.inputWrapper}>
              <p className={styles.labelInput}>From:</p>
              <DatePicker
                className={`form-control ${styles.input}`}
                selected={this.state.from}
                onChange={this.handleTimeChange("from")}
                todayButton={"Select Today"}
                maxDate={to}
              />
            </div>
            <div>
              <p className={styles.labelInput}>To:</p>
              <DatePicker
                className={`form-control ${styles.input}`}
                selected={this.state.to}
                onChange={this.handleTimeChange("to")}
                todayButton={"Select Today"}
                minDate={from}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  tutors: state.tutor.data.tutors
});

export default connect(
  mapStateToProps,
  { fetchAllTutors, clear }
)(ReportTutorTable);
