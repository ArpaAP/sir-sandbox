import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

const Navibar: React.FC = () => {
  return (
    <Navbar variant="dark" bg="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/">SIR 샌드박스</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>홈</Nav.Link>
            <NavDropdown title="정보" id="nav-dropdown">
              <NavDropdown.Item
                href="https://github.com/ArpaAP/seir-sandbox"
                target="_blank"
              >
                GitHub에서 소스 코드 보기
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item disabled>
                제작 - 2021 호산고등학교 1학년 8반 12번 황부연
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navibar;
