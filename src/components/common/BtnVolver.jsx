import React from "react";
import { useNavigate } from "react-router-dom";
import {FaStepBackward }from "react-icons/fa";
const BtnVolver = (props) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(props.route? props.route :-1);
  };

    return (
        <button
        className="justify-content-center btn botonCPA me-3 d-flex align-items-center"
        onClick={handleGoBack}
        style={props.style}
      >
        <FaStepBackward/> Volver
      </button>
    );
};

export default BtnVolver;