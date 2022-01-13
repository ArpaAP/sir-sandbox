import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, Card, ProgressBar } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Footer from "./components/Footer";
import Navibar from "./components/Navibar";
import { throttle } from "lodash";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  {
    id: "LineWithLine",
    afterDatasetsDraw: (chart) => {
      let chart_type = chart.config.type;
      if (
        chart.tooltip?.getActiveElements() &&
        chart.tooltip?.getActiveElements().length > 0 &&
        chart_type === "line"
      ) {
        let activePoint = chart.tooltip.getActiveElements()[0];
        let ctx = chart.ctx;
        let x_axis = chart.scales.x;
        let y_axis = chart.scales.y;

        let x = activePoint.element.tooltipPosition().x;

        let topY = y_axis.top;
        let bottomY = chart.chartArea.bottom;

        // draw line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY + 7);
        ctx.lineTo(x, bottomY + 1);
        ctx.setLineDash([2, 3]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#555";
        ctx.stroke();
        ctx.restore();
      }
    },
  }
);

const App: React.FC = () => {
  const [XIndex, setXIndex] = useState(0);
  const [darkmode, setDarkmode] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const colorChangeListener = (e: MediaQueryListEvent) => {
      setDarkmode(!!e.matches);
    };
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", colorChangeListener);

    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", colorChangeListener);
  }, []);

  const throttledHover = useMemo(
    () =>
      throttle((event, elements, chart) => {
        let activePoint = chart.tooltip?.getActiveElements()[0];
        let x = (activePoint?.index ?? 0) / 2;
        setXIndex(x);
        console.log(x);
      }, 240),
    []
  );

  const [S, setS] = useState(500);
  const [I, setI] = useState(20);
  const [R, setR] = useState(0);
  const [beta, setBeta] = useState(0.21);
  const [gamma, setGamma] = useState(0.07);
  const [ra, setRa] = useState(2.5);
  const [loop, setLoop] = useState(150);

  const s = S / (S + I + R) || 0;
  const i = I / (S + I + R) || 0;
  const r = R / (S + I + R) || 0;

  const susceptibleData = [s];
  const infectedData = [i];
  const recoveredData = [r];

  for (let i = 0; i < loop; i++) {
    const dS = beta * susceptibleData[i] * infectedData[i];
    const dR = gamma * infectedData[i];

    const s_ = susceptibleData[i] - dS * ra;
    const i_ = infectedData[i] + (dS - dR) * ra;
    const r_ = recoveredData[i] + dR * ra;

    susceptibleData.push(s_);
    infectedData.push(i_);
    recoveredData.push(r_);
  }

  const sNow = susceptibleData[Math.round(XIndex * 2)];
  const iNow = infectedData[Math.round(XIndex * 2)];
  const rNow = recoveredData[Math.round(XIndex * 2)];

  return (
    <div
      style={{
        backgroundColor: darkmode ? "#171a1f" : undefined,
        fontFamily: "NanumSquare",
        color: darkmode ? "white" : undefined,
      }}
    >
      <Navibar />
      <Container fluid style={{ minHeight: "85vh" }}>
        <Row className="mt-3 text-center">
          <h3 className="m-0 fw-bold">전염병 확산 예측 모델 모의실험</h3>
        </Row>
        <hr />
        <Row>
          <Col xs={12} md={6} xxl={3}>
            <Card
              bg={darkmode ? "dark" : "white"}
              text={darkmode ? "white" : "dark"}
              className="shadow-sm my-3"
            >
              <Card.Header as="h5">초기 변수 | Initial Variables</Card.Header>
              <Card.Body className="py-3">
                <Form>
                  <Form.Group as={Row} className="mb-3" controlId="Susceptible">
                    <Col sm={9} md={8}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        취약군 (
                        <b>
                          <i>S</i>
                        </b>
                        , Susceptible)
                      </Form.Label>
                      <div>
                        <Form.Text>
                          감염될 수 있으나 아직 감염되지 않은 개체의 수
                        </Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} md={4} className="ms-auto">
                      <Form.Control
                        type="number"
                        value={S.toString()}
                        onChange={(e) =>
                          setS(Math.max(Number(e.target.value), 0))
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3" controlId="Infected">
                    <Col sm={9} md={8}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        감염군 (
                        <b>
                          <i>I</i>
                        </b>
                        , Infected)
                      </Form.Label>
                      <div>
                        <Form.Text>병을 전염시킬 수 있는 개체의 수</Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} md={4} className="ms-auto">
                      <Form.Control
                        type="number"
                        value={I.toString()}
                        onChange={(e) =>
                          setI(Math.max(Number(e.target.value), 0))
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3" controlId="Recovered">
                    <Col sm={9} md={8}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        회복군 (
                        <b>
                          <i>R</i>
                        </b>
                        , Recovered)
                      </Form.Label>
                      <div>
                        <Form.Text>
                          병에서 회복한 개체의 수와 격리 중 사망한 개체의 수의
                          합
                        </Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} md={4} className="ms-auto">
                      <Form.Control
                        type="number"
                        value={R.toString()}
                        onChange={(e) =>
                          setR(Math.max(Number(e.target.value), 0))
                        }
                      />
                    </Col>
                  </Form.Group>
                  <hr />
                  <Form.Group as={Row} className="mb-3" controlId="Beta">
                    <Col sm={9}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        감염률 (
                        <b>
                          <i>β</i>
                        </b>
                        , Beta)
                      </Form.Label>
                      <div>
                        <Form.Text>
                          감염이 얼마나 효과적(빠르게)으로 일어나는지
                          결정합니다. 평균 접촉 시간의 역수입니다.
                        </Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} className="ms-auto">
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={beta.toString()}
                        onChange={(e) =>
                          setBeta(Math.max(Number(e.target.value), 0))
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3" controlId="Beta">
                    <Col sm={8} md={9}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        회복률 (
                        <b>
                          <i>γ</i>
                        </b>
                        , Gamma)
                      </Form.Label>
                      <div>
                        <Form.Text>
                          회복이 얼마나 효과적으로(빠르게) 일어나는지
                          결정합니다. 평균 감염 기간의 역수입니다.
                        </Form.Text>
                      </div>
                    </Col>
                    <Col sm={4} md={3} className="ms-auto">
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={gamma.toString()}
                        onChange={(e) =>
                          setGamma(Math.max(Number(e.target.value), 0))
                        }
                      />
                    </Col>
                  </Form.Group>

                  <hr />
                  <h6>초기 개체군 구성 비율</h6>

                  <Form.Group>
                    <Col>
                      {S + I + R > 0 ? (
                        <ProgressBar>
                          <ProgressBar
                            variant="warning"
                            now={s * 100}
                            key={1}
                            label="취약군"
                            className="text-black"
                          />
                          <ProgressBar
                            variant="danger"
                            now={i * 100}
                            key={2}
                            label="감염군"
                          />
                          <ProgressBar
                            variant="success"
                            now={r * 100}
                            key={3}
                            label="회복군"
                          />
                        </ProgressBar>
                      ) : (
                        <ProgressBar
                          now={100}
                          label="변수를 먼저 입력하세요"
                          variant="dark"
                        />
                      )}

                      <div className="pt-2">
                        <span style={{ color: "orange" }}>
                          취약군: {Math.round(s * 100 * 10) / 10 || 0}%
                        </span>{" "}
                        |{" "}
                        <span className="text-danger">
                          감염군: {Math.round(i * 100 * 10) / 10 || 0}%
                        </span>{" "}
                        |{" "}
                        <span className="text-success">
                          회복군: {Math.round(r * 100 * 10) / 10 || 0}%
                        </span>
                      </div>
                    </Col>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col
            xs={12}
            md={{ span: 12, order: "first" }}
            xxl={{ span: 6, order: 0 }}
          >
            <Line
              options={{
                elements: {
                  point: {
                    radius: 0,
                  },
                  line: {
                    tension: 0.1,
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 24,
                    },
                  },
                },
                onHover: throttledHover,
                interaction: {
                  mode: "nearest",
                  intersect: false,
                },
                plugins: {
                  tooltip: {
                    mode: "index",
                    intersect: false,
                  },
                },
                hover: {
                  mode: "nearest",
                  intersect: true,
                },
              }}
              data={{
                labels: Array.from(
                  {
                    length: Math.max(
                      susceptibleData.length,
                      infectedData.length,
                      recoveredData.length
                    ),
                  },
                  (_, i) => Math.round(i * ra * 100) / 100
                ),
                datasets: [
                  {
                    label: "취약군",
                    data: susceptibleData,
                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                    borderColor: "rgba(255, 159, 64, 1)",
                    borderWidth: 5,
                    fill: false,
                  },
                  {
                    label: "감염군",
                    data: infectedData,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 5,
                    fill: false,
                  },
                  {
                    label: "회복군",
                    data: recoveredData,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 5,
                    fill: false,
                  },
                ],
              }}
            />

            <Card
              bg={darkmode ? "dark" : "white"}
              text={darkmode ? "white" : "dark"}
              className="shadow-sm my-3"
            >
              <Card.Header as="h5">시뮬레이션 설정 | Settings</Card.Header>
              <Card.Body className="pt-3 pb-0">
                <Form as={Row} className="d-flex">
                  <Col xl={6}>
                    <Form.Group as={Row} className="mb-3">
                      <Col sm={8}>
                        <Form.Label
                          className="fw-bold"
                          style={{ fontSize: 18 }}
                        >
                          시간 간격
                        </Form.Label>
                        <div>
                          <Form.Text>
                            얼마나 정밀하게 계산을 진행할지를 결정합니다 (값이
                            낮을수록 정밀한 간격). 간격이 너무 좁으면 랙을
                            유발할 수 있습니다.
                          </Form.Text>
                        </div>
                      </Col>
                      <Col
                        sm={4}
                        className="ms-auto d-flex align-items-center h-100"
                      >
                        <Form.Control
                          className="me-4"
                          type="number"
                          step="0.05"
                          value={ra.toString()}
                          onChange={(e) =>
                            setRa(Math.max(Number(e.target.value), 0))
                          }
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Group as={Row} className="mb-3">
                      <Col sm={8}>
                        <Form.Label
                          className="fw-bold"
                          style={{ fontSize: 18 }}
                        >
                          반복 횟수
                        </Form.Label>
                        <div>
                          <Form.Text>
                            얼마나 미래까지 시뮬레이션을 진행할지를 결정합니다.
                          </Form.Text>
                        </div>
                      </Col>
                      <Col
                        sm={4}
                        className="ms-auto d-flex align-items-center h-100"
                      >
                        <Form.Control
                          className="me-2"
                          type="number"
                          step="5"
                          max="1000"
                          value={loop.toString()}
                          onChange={(e) =>
                            setLoop(Math.max(Number(e.target.value), 0))
                          }
                        />
                        회
                      </Col>
                    </Form.Group>
                  </Col>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} xxl={3}>
            <Card
              bg={darkmode ? "dark" : "white"}
              text={darkmode ? "white" : "dark"}
              className="shadow-sm my-3"
            >
              <Card.Header as="h5">결괏값 | Results</Card.Header>
              <Card.Body className="pt-3 pb-0">
                <Form>
                  <h6>현재 시간 (t)</h6>
                  <Form.Group className="mb-3">
                    <ProgressBar
                      now={XIndex * ra * 2}
                      label={XIndex * ra * 2}
                      max={ra * loop}
                      animated
                      variant="secondary"
                    />
                  </Form.Group>

                  <h6>현재 개체군 구성 비율</h6>
                  <Form.Group>
                    <Col>
                      {sNow + iNow + rNow > 0 ? (
                        <ProgressBar>
                          <ProgressBar
                            variant="warning"
                            now={sNow * 100}
                            key={1}
                            label="취약군"
                            className="text-black"
                          />
                          <ProgressBar
                            variant="danger"
                            now={iNow * 100}
                            key={2}
                            label="감염군"
                          />
                          <ProgressBar
                            variant="success"
                            now={rNow * 100}
                            key={3}
                            label="회복군"
                          />
                        </ProgressBar>
                      ) : (
                        <ProgressBar
                          now={100}
                          label="변수를 먼저 입력하세요"
                          variant="dark"
                        />
                      )}

                      <div className="pt-2">
                        <span style={{ color: "orange" }}>
                          취약군: {Math.round(sNow * 100 * 10) / 10 || 0}%
                        </span>{" "}
                        |{" "}
                        <span className="text-danger">
                          감염군: {Math.round(iNow * 100 * 10) / 10 || 0}%
                        </span>{" "}
                        |{" "}
                        <span className="text-success">
                          회복군: {Math.round(rNow * 100 * 10) / 10 || 0}%
                        </span>
                      </div>
                    </Col>
                  </Form.Group>
                  <hr />
                  <Form.Group as={Row} className="mb-3">
                    <Col sm={9}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        감염의 강도 (
                        <b>
                          <i>βI </i>
                        </b>
                        )
                      </Form.Label>
                      <div>
                        <Form.Text>
                          <i>βi</i> 의 값과 같습니다.
                        </Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} className="ms-auto d-flex align-items-center">
                      <h5 className="fw-bold">
                        {Math.round(beta * iNow * 1000) / 1000}
                      </h5>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Col sm={9}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        시간에 따른 취약자 증가율 (
                        <b>
                          <i>ds/dt </i>
                        </b>
                        )
                      </Form.Label>
                      <div>
                        <Form.Text>
                          <i>-βsi</i>, 즉 감염자로의 유출의 값과 같습니다.
                        </Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} className="ms-auto d-flex align-items-center">
                      <h5 className="fw-bold">
                        {Math.round(-1 * beta * sNow * iNow * 1000) / 1000}
                      </h5>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Col sm={9}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        시간에 따른 감염자 증가율 (
                        <b>
                          <i>di/dt </i>
                        </b>
                        )
                      </Form.Label>
                      <div>
                        <Form.Text>
                          <i>βsi-γi</i>, 즉 취약자에서의 유입에서 회복자로의
                          유출을 뺀 값과 같습니다.
                        </Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} className="ms-auto d-flex align-items-center">
                      <h5 className="fw-bold">
                        {Math.round(
                          (beta * sNow * iNow - gamma * iNow) * 1000
                        ) / 1000}
                      </h5>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Col sm={9}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        시간에 따른 회복자 증가율 (
                        <b>
                          <i>dr/dt </i>
                        </b>
                        )
                      </Form.Label>
                      <div>
                        <Form.Text>
                          <i>γi</i> 의 값과 같습니다.
                        </Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} className="ms-auto d-flex align-items-center">
                      <h5 className="fw-bold">
                        {Math.round(gamma * iNow * 1000) / 1000}
                      </h5>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Col sm={9}>
                      <Form.Label className="fw-bold" style={{ fontSize: 18 }}>
                        R<sub>0</sub> (
                        <b>
                          <i>βs/γ </i>
                        </b>
                        )
                      </Form.Label>
                      <div>
                        <Form.Text>
                          기초감염재생산수, 첫 감염자가 평균적으로 감염시킬 수
                          있는 2차 감염자의 수를 뜻합니다. 1보다 크면 대확산의
                          가능성이 있습니다.
                        </Form.Text>
                      </div>
                    </Col>
                    <Col sm={3} className="ms-auto d-flex align-items-center">
                      <h5 className="fw-bold">
                        {gamma > 0
                          ? Math.round(((beta * sNow) / gamma) * 1000) / 1000 ||
                            "-"
                          : "∞"}
                      </h5>
                    </Col>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default App;
