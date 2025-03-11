import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStepBackward } from "react-icons/fa";
import { Button } from "react-bootstrap";

const BtnVolver = (props) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(props.route ? props.route : -1);
  };

  return (
    <Button
      className="justify-content-center btn boton me-3 d-flex align-items-center"
      onClick={handleGoBack}
      style={props.style}
    >
      <FaStepBackward /> Volver
    </Button>
  );
};

export default BtnVolver;
