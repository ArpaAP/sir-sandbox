import React from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import Navibar from "./components/Navibar";

const App: React.FC = () => {
  const isDarkmode = localStorage.getItem("darkmode") === "true";

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: isDarkmode ? "#333" : undefined,
        fontFamily: "NanumSquare",
      }}
    >
      <Navibar />
      <Container fluid>
        <Row>
          <Col xs={3}>
            <Card
              bg={isDarkmode ? "dark" : "white"}
              text={isDarkmode ? "white" : "dark"}
              className="shadow-sm my-3"
            >
              <Card.Header as="h5">변수</Card.Header>
              <Card.Body className="pt-3 pb-0">
                <Form>
                  <Form.Group as={Row} className="mb-3" controlId="Susceptible">
                    <Col sm={9}>
                      <Form.Label>감염 대상군 (Susceptible)</Form.Label>
                      <div>
                        <Form.Text>감염될 수 있으나 아직 감염되지 않은 개체의 수</Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} className="ms-auto">
                      <Form.Control defaultValue={10} />
                    </Col>
                  </Form.Group>
                  <hr />
                  <Form.Group as={Row} className="mb-3" controlId="Exposed">
                    <Col sm={9}>
                      <Form.Label>접촉군 (Exposed)</Form.Label>
                      <div>
                        <Form.Text>이미 감염되었으나 아직 병을 전염시키지는 않는 단계에 있는 개체의 수</Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} className="ms-auto">
                      <Form.Control defaultValue={10} />
                    </Col>
                  </Form.Group>
                  <hr />
                  <Form.Group as={Row} className="mb-3" controlId="Infected">
                    <Col sm={9}>
                      <Form.Label>감염군 (Infected)</Form.Label>
                      <div>
                        <Form.Text>병을 전염시킬 수 있는 개체의 수</Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} className="ms-auto">
                      <Form.Control defaultValue={10} />
                    </Col>
                  </Form.Group>
                  <hr />
                  <Form.Group as={Row} className="mb-3" controlId="Recovered">
                    <Col sm={9}>
                      <Form.Label>회복군 (Recovered)</Form.Label>
                      <div>
                        <Form.Text>병에서 회복한 개체의 수와 격리 중 사망한 개체의 수의 합</Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} className="ms-auto">
                      <Form.Control defaultValue={10} />
                    </Col>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
          <Col xs={3}></Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
