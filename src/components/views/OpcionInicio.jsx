import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

const OpcionInicio = ({ imagen, texto, ruta }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(ruta);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Card
      className="my-2"
      style={{
        width: "16rem",
        justifyContent: "center",
        alignItems: "center",
        transition: "transform 0.3s",
        cursor: "pointer",
        transform: isHovered ? "scale(1.08)" : "scale(1)",
      }}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card.Img variant="top" src={imagen} className="p-4" />
      <Card.Body style={{ justifyContent: "center" }}>
        <Card.Title className="text-center">
          <h2>
            <strong>{texto}</strong>
          </h2>
        </Card.Title>
      </Card.Body>
      <Card.Footer
        style={{ backgroundColor: "white", border: "0" }}
      ></Card.Footer>
    </Card>
  );
};

export default OpcionInicio;
