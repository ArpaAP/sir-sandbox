import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white">
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
        </Row>
        <div className="text-center">
          Copyright © 2022 ArpaAP All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
