import * as React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

export const AppoinmentPanel = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Appoinment Panel</h1>
      <div className={styles.btnWrapper}>
        <Link
          className={`btn active-btn ${styles.btn}`}
          to="/admin/appointments"
        >
          VIEW/CANCEL
        </Link>
      </div>
    </div>
  );
};
