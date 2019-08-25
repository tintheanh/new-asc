import * as React from "react";
import { ButtonProps } from "./props";

const getClassName = (loading: boolean, disable: boolean) => {
  if (loading || disable) {
    return "disable-btn";
  }
  return "active-btn";
};

export const Button: React.SFC<ButtonProps> = props => {
  const { customClassName, label, onClick, type, disabled, loading } = props;
  return (
    <button
      className={`btn ${getClassName(loading!, disabled!)} ${customClassName}`}
      type={type}
      disabled={disabled ? disabled : loading ? true : false}
      onClick={onClick}
    >
      {!loading ? (
        label.toUpperCase()
      ) : (
        <div className="spinner">
          <div className="bounce1" />
          <div className="bounce2" />
          <div className="bounce3" />
        </div>
      )}
    </button>
  );
};

Button.defaultProps = {
  customClassName: "",
  type: "button",
  disabled: false,
  loading: false,
  onClick: null
};
