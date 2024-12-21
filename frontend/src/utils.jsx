import { useNavigate } from "react-router-dom";
import React from "react";
import "./Login.css";

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    return <Component navigate={navigate} {...props} />;
  };
  return Wrapper;
};
