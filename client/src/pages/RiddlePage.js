import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

import Alerts from '../components/Alerts'
import Amount from '../components/Amount'
import Layout from '../components/Layout'
import { addView } from '../components/RecentlyViewed'
import TransactionLink from '../components/TransactionLink'


function Riddle({ data, onSubmit }) {

  let [riddleExpanded, setRiddleExpanded] = useState(false);

  let [answerExpanded, setAnswerExpanded] = useState(false);

  let riddleCard = (
    <Card className="riddle-card">
      <span className="riddle-card-label">Riddle</span>
      <span className="riddle-card-info">
        <div onClick={() => setRiddleExpanded(!riddleExpanded)}>
          <FontAwesomeIcon icon={faInfo} size="xs" />
        </div>
      </span>
      <h2>{data.riddleText}</h2>
      {(!data.isAnswered || riddleExpanded) && (
        <>
          {(data.prize > 0 || riddleExpanded) && (
            <Row className="mt-3">
              <Col>
                <h4 className="me-3">Prize:</h4>
              </Col>
              <Col>
                <Amount weiValue={data.prize} />
              </Col>
            </Row>
          )}
          {(data.guessCost > 0 || riddleExpanded) && (
            <Row className="mt-3">
              <Col>
                <h4 className="me-3">Cost to guess:</h4>
              </Col>
              <Col>
                <Amount weiValue={data.guessCost} />
              </Col>
            </Row>
          )}
        </>
      )}
      {riddleExpanded && (
        <>
          <br/>
          <p>
            <b>Owner:</b> {data.owner}
          </p>
        </>
      )}
    </Card>
  );

  return data.isAnswered ? (
    <>
      {riddleCard}
      <Card className="riddle-card">
        <span className="riddle-card-label">Answer</span>
        <span className="riddle-card-info">
          <div onClick={() => setAnswerExpanded(!answerExpanded)}>
            <FontAwesomeIcon icon={faInfo} size="xs" />
          </div>
        </span>
        <h4>{data.answerText}</h4>
        {answerExpanded && (
          <>
            <br/>
            <p>
              <b>Winner:</b> {data.winner}
            </p>
          </>
        )}
      </Card>
    </>
  ) : (
    <>
      {riddleCard}
      <GuessForm onSubmit={onSubmit} />
    </>
  )
}

function GuessForm({ onSubmit }) {
  let form = (
    <Form onSubmit={onSubmit}>
      <div className="d-flex">

        <div className="flex-grow-1">
          <Form.Group controlId="guessInput">
            <Form.Control type="text" placeholder="Enter Guess" />
          </Form.Group>
        </div>

        <div className="ms-2">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>

      </div>
    </Form>
  );
  return form;
}

function guess(value, data, app) {
  return data.contract.guess(
    value,
    {from: app.state.accounts[0], value: data.data.guessCost}
  );
}

class RiddlePage extends React.Component {

  state = { 
    errors: [],
    messages: [],
    data: { needsLoad: true, loading: false, contract: null, data: null, error: null }
  }

  getData() { return this.state.data }

  setData(data) { this.setState({ data }) }

  getMessages() { return this.state.messages }

  setMessages(messages) { this.setState({ messages }) }

  getErrors() { return this.state.errors }

  setErrors(errors) { this.setState({ errors }) }

  loadContract() {
    if (this.state.data.loading) {
      return;
    }

    let address = this.props.match.params.id;
    this.setData({ loading: true, needsLoad: false });

    if (!this.props.app.state.Riddle) {
      this.setData({ loading: false, needsLoad: true });
      return;
    }
    if (this.state.data.contract && this.state.data.data.address === address) {
      return;
    }

    this.props.app.state.Riddle.at(address).then((instance) => {
      Promise.all([
        instance.riddleText(),
        instance.prize(),
        instance.guessCost(),
        instance.isAnswered(),
        instance.owner()
      ]).then(([riddleText, prize, guessCost, isAnswered, owner]) => {
        if (isAnswered) {
          Promise.all([
            instance.answerText(),
            instance.winner()
          ]).then(([answerText, winner]) => {
            addView({
              id: address,
              text: riddleText,
              answered: isAnswered,
              answerText,
              winner
            });
            this.setData({
              loading: false,
              contract: instance,
              address,
              needsLoad: false,
              data: {
                riddleText,
                prize: prize,
                guessCost: guessCost,
                isAnswered,
                answerText,
                winner,
                owner,
                address
              }
            })        
          })
        } else {
          addView({
            id: address,
            text: riddleText,
            answered: isAnswered
          });
          this.setData({
            loading: false,
            contract: instance,
            address,
            needsLoad: false,
            data: {
              riddleText,
              prize: prize,
              guessCost: guessCost,
              isAnswered,
              owner,
              address
            }
          })
        }
      })
    }).catch((err) => {
      this.setErrors(["Error loading contract: " + err.message])
      this.setMessages([]);
      this.setData({ loading: false, needsLoad: false, error: err });
    });
  }

  submitForm() { return (evt) => {
    evt.preventDefault();

    let form = evt.target;

    let guessValue = form.guessInput.value;
    if (guessValue) {
      let promise = guess(guessValue, this.state.data, this.props.app);

      promise.on("transactionHash", (txHash) => {
        this.setMessages([(
          <>
            {"Waiting for transaction to complete. "}
            <TransactionLink txHash={txHash} networkId={this.props.app.state.networkId} /> 
            {" The page will update when it is complete."}
          </>
        )]);
        this.setErrors([]);
      });

      promise.then((correct) => {
        Promise.all([
          this.state.data.contract.answerText(),
          this.state.data.contract.isAnswered(),
          this.state.data.contract.winner()
        ]).then(([answer, isAnswered, winner]) => {
          if (isAnswered && winner === this.props.app.state.accounts[0] && answer === guessValue) {
            this.setMessages(["Your guess was correct."]);
            this.setErrors([]);
            this.loadContract();
          } else {
            this.setMessages([]);
            this.setErrors(["Your guess was not correct"]);
          }
        })
      }).catch((err) => {
        this.setErrors(["Error submitting guess: " + err.message])
      })
    } else {
      this.setErrors(["Invalid guess."]);
      this.setMessages([]);
    } 
  }}

  componentDidMount() {
    this.loadContract();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.loadContract();
    }

    if (!prevState.needsLoad && this.state.needsLoad) {
      this.loadContract();
    }

    // if (this.state.needsLoad && !this.state.loading) {
    //   this.loadContract();
    // }
  }

  render() {
    let { app } = this.props;

    const errors = this.state.errors;
    const setErrors = (errs) => this.setState({ errors: errs });

    const messages = this.state.messages;
    const setMessages = (msgs) => this.setState({ messages: msgs });

    const data = this.state.data;

    app.onMount = () => {
      this.loadContract();
    }

    return (
      <Layout>
        <Alerts messages={messages} setMessages={setMessages} variant="success" />
        <Alerts messages={errors} setMessages={setErrors} variant="danger" />
        {data.loading || data.needsLoad ? (
          <div className="riddle-spinner">
            <Spinner animation="border" variant="secondary">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : data.error ? (
          <></> 
        ) : (
          <Riddle data={data.data} onSubmit={this.submitForm()} />
        )}
      </Layout>
    )

  }

}

export default RiddlePage
