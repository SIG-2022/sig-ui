import React from "react";
import logoicn from "../../../assets/images/logo-dark.svg";
const LogoIcon = (props) => {
  //TODO change logo
  return <img alt="Logo" src={logoicn} {...props} />;
};

export default LogoIcon;
