import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { Link } from 'react-router-dom'

function createRiddle(riddle, answer, prize, cost, cb) {
  cb();
}

function validateAndCreateRiddle(event, setErrors, setMessages) {
  let form = event.target;

  let riddleText = form["formRiddleText"].value;
  let riddleAnswer = form["formRiddleAnswer"].value;
  let riddleAnswerConfirm = form["formRiddleAnswerConfirm"].value;
  let prize = form["formPrizeValue"].value;
  let cost = form["formGuessCost"].value;

  let errors = [];

  if (!riddleText) {
    errors.push("No riddle added.");
  }

  if (!riddleAnswer) {
    errors.push("No riddle answer added");
  } else if (riddleAnswer != riddleAnswerConfirm) {
    errors.push("Riddle answer did not match confirmation.");
  }

  if (prize < 0) {
    errors.push("Prize cannot be negative.");
  }
  if (cost < 0) {
    errors.push("Guess cost cannot be negative.");
  }

  setErrors(errors);
  // success!
  if (errors.length == 0) {
    createRiddle(riddleText, riddleAnswer, prize, cost, () => {
      setMessages(["Riddle created successfully."])
    });
  } else {
    setMessages([]);
  }

}

function FormErrors({ errors }) {
  return (
    <>
      {errors.map((err, i) => <Alert key={i} variant="danger">{err}</Alert>)}
    </>
  )
}

function FormMessages({ messages }) {
  return (
    <>
      {messages.map((err, i) => <Alert key={i} variant="success">{err}</Alert>)}
    </>
  )
}

export default function HomePage() {

  const [errors, setErrors] = useState([]);

  const [messages, setMessages] = useState([]);

  return (
    <Container>
      <div className="home-page-container">
        <Form onSubmit={(evt) => {
          evt.preventDefault();
          return validateAndCreateRiddle(evt, setErrors, setMessages);
        }}>
          <div className="text-center mt-5">
            <h1>Create a Riddle</h1>
          </div>

          <FormMessages messages={messages} />
          <FormErrors errors={errors} />

          <Form.Group controlId="formRiddleText" className="mb-2">
            <Form.Label>Riddle Text</Form.Label>
            <Form.Control type="text" placeholder="Enter Riddle" />
          </Form.Group>

          <Form.Group controlId="formRiddleAnswer" className="mb-2">
            <Form.Label>Riddle Result</Form.Label>
            <Form.Control type="password" placeholder="Enter Answer" />
          </Form.Group>

          <Form.Group controlId="formRiddleAnswerConfirm" className="mb-2">
            <Form.Label>Confirm Riddle Result</Form.Label>
            <Form.Control type="password" placeholder="Enter Answer" />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group controlId="formPrizeValue" className="mb-2">
                <Form.Label>Prize Value (Wei)</Form.Label>
                <Form.Control type="number" placeholder="Enter Prize Value" defaultValue="0" />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="formGuessCost" className="mb-4">
                <Form.Label>Guess Cost (Wei)</Form.Label>
                <Form.Control type="number" placeholder="Enter Prize Value" defaultValue="0" />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Submit
          </Button>

        </Form>
      </div>
    </Container>
  )
}
