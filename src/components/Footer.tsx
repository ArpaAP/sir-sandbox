import React, { useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";

const Footer: React.FC = () => {
  const [darkmode, setDarkmode] = useState(
    localStorage.getItem("darkmode") === "true"
  );

  return (
    <footer
      className="bg-dark text-white"
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      <Container fluid="sm" className="text-center text-md-start py-4">
        <Row>
          <Col xs={5} className="mt-md-0 mt-3">
            <h4 className="text-uppercase no-drag">SIR SANDBOX</h4>
            <p
              className="mb-2"
              style={{
                fontSize: "13pt",
              }}
            >
              2021 호산고 윈터스쿨 주제탐구 프로젝트
            </p>
          </Col>
          <Col xs={7} className="d-flex text-right">
            <Button
              className="ms-auto my-auto"
              variant="outline-light"
              onClick={() => {
                localStorage.setItem("darkmode", (!darkmode).toString());
                window.location.reload();
              }}
            >
              {darkmode ? "다크모드 끄기" : "다크모드 켜기"}
            </Button>
          </Col>
        </Row>
        <div className="text-center">Copyright © 2022</div>
      </Container>
    </footer>
  );
};

export default Footer;
