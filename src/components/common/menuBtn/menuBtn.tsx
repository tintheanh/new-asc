import * as React from "react";
import { connect } from "react-redux";
// import { MenuBtnProps } from './props';
import styles from "./styles.module.css";

const MenuBtn: React.SFC<any> = props => {
  const {
    label,
    navigate,
    route,
    type,
    tutorReportOption,
    subjectReportOption,
    appointmentReportOption
  } = props;
  let option;
  if (type === "main-menu") option = route;
  else if (type === "tutor-report-option") option = tutorReportOption;
  else if (type === "subject-report-option") option = subjectReportOption;
  else if (type === "appointment-report-option")
    option = appointmentReportOption;
  return (
    // <button className={styles.menubtn} style={{ background: isSelected ? 'rgb(49, 129, 246)' : 'grey' }}>
    <button
      className={styles.menubtn}
      onClick={navigate}
      style={{
        background:
          option === label ? "rgba(75, 171, 82, 1)" : "rgba(0, 0, 0, 0.3)"
      }}
    >
      {label}
      <span style={{ float: "right" }}>&#8594;</span>
    </button>
  );
};

const mapStateToProps = (state: any) => ({
  route: state.navigation.route,
  tutorReportOption: state.navigation.tutorReportOption,
  subjectReportOption: state.navigation.subjectReportOption,
  appointmentReportOption: state.navigation.appointmentReportOption
});

export default connect(
  mapStateToProps,
  null
)(MenuBtn);
