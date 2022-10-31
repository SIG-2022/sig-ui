import React from "react";
import logoicn from "../../../assets/images/universidad-austral.png";
const LogoIcon = (props) => {
  //TODO change logo
  return <img alt="Logo" src={logoicn} {...props} width={219} height={80} />;
};

export default LogoIcon;
