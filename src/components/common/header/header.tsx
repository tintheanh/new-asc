import * as React from "react";
import styles from "./styles.module.css";
import { HeaderProps } from "./props";

export const Header: React.SFC<HeaderProps> = props => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{props.title}</h1>
    </div>
  );
};
