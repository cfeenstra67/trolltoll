import Crypto from 'crypto'
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { useHistory } from 'react-router-dom'

import { getRiddleUrl } from '../App'
import Alerts from '../components/Alerts'
import AmountInput from '../components/AmountInput'
import Layout from '../components/Layout'
import TransactionLink from '../components/TransactionLink'


function createRiddle(riddle, answer, prize, cost, app, hashCb) {
  let { Riddler, accounts } = app.state;
  let salt = Crypto.randomBytes(16).toString("hex");
  // console.log(riddle, answer, prize, cost, salt, Riddler, app.state);

  return Riddler.deployed().then(async function(instance) {
    let creatorFeePercent = (await instance.creatorFeePercent()).toNumber();
    let oneHundred = 100;
    let prizeWithFee = parseInt((prize * (oneHundred + creatorFeePercent)) / oneHundred);

    let resPromise = instance.riddleMeThis(
      riddle,
      answer,
      cost,
      salt,
      {value: prizeWithFee, from: accounts[0]}
    );

    if (hashCb) {
      resPromise.on("transactionHash", hashCb);
    }

    let res = await resPromise;

    let resultLog = res.logs[0]
    if (!resultLog) {
      throw new Error("Result event not found!");
    }
    let address = resultLog.args[1];

    if (!address) {
      throw new Error("Transaction error: " + res)
    }

    return address;
  });

}

async function validateAndCreateRiddle(event, setErrors, setMessages, app, navigate) {
  let form = event.target;

  let riddleText = form["formRiddleText"].value;
  let riddleAnswer = form["formRiddleAnswer"].value;
  let riddleAnswerConfirm = form["formRiddleAnswerConfirm"].value;
  let prize = parseInt(form["formPrizeValue"].getAttribute("data-value-wei"));
  let cost = parseInt(form["formGuessCost"].getAttribute("data-value-wei"));

  let errors = [];

  if (!riddleText) {
    errors.push("No riddle added.");
  }

  if (!riddleAnswer) {
    errors.push("No riddle answer added");
  } else if (riddleAnswer !== riddleAnswerConfirm) {
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
  if (errors.length === 0) {
    createRiddle(
      riddleText, riddleAnswer, prize, cost, app,
      (txHash) => {
        setMessages([(
          <>
            {"Waiting for transaction to complete. "}
            <TransactionLink txHash={txHash} networkId={app.state.networkId} /> 
            {" You'll be redirected when it is complete."}
          </>
        )]);
      }
    ).then((address) => {
      setMessages(["Riddle created successfully."]);
      navigate(getRiddleUrl(address));
    }).catch(function(err) {
      console.error(err);
      setErrors(["Error creating riddle: " + err.message]);
    });
  } else {
    setMessages([]);
  }

}

export default function HomePage({ app, ...props }) {

  const [errors, setErrors] = useState([]);

  const [messages, setMessages] = useState([]);

  const history = useHistory();

  function navigate(url) {
    history.push(url);
  }

  return (
    <Layout>
      <div className="home-page-container">
        <Form onSubmit={(evt) => {
          evt.preventDefault();
          validateAndCreateRiddle(evt, setErrors, setMessages, app, navigate);
        }}>
          <div className="text-center mt-5">
            <h1>Create a Riddle</h1>
          </div>

          <Alerts messages={messages} setMessages={setMessages} variant="success" />
          <Alerts messages={errors} setMessages={setErrors} variant="danger" />

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
                <Form.Label>Prize Value</Form.Label>
                <Form.Control as={AmountInput} />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="formGuessCost" className="mb-4">
                <Form.Label>Guess Cost (this will go to you)</Form.Label>
                <Form.Control as={AmountInput} />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Submit
          </Button>

        </Form>
      </div>
    </Layout>
  )
}
