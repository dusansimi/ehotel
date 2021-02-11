import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import './AboutAdmin.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';

toast.configure();

class AboutAdmin extends Component {
  state = {
    object: null,
    textArea: '',
  };
  componentDidMount() {
    axios
      .get('http://localhost:8000/api/about')
      .then((response) => {
        console.log(response);
        this.setState({ object: response.data.data.doc[0] });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onChangeHandler = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  onUpdHandler = (event) => {
    console.log(this.state.textArea);
    console.log(this.state.object._id);
    if (this.state.textArea !== '') {
      const aboutData = {
        description: this.state.textArea,
      };
      const config = {
        headers: { Authorization: `Bearer ${this.props.token}` },
      };
      axios
        .patch(
          'http://localhost:8000/api/about/' + this.state.object._id,
          aboutData,
          config
        )
        .then((response) => {
          console.log(response);
          window.location.reload(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast('Unesi deskripciju', {
        type: 'error',
      });
    }
  };
  render() {
    let pom = null;
    if (this.state.object !== null) {
      pom = (
        <div className='text-center'>
          <h1 className='mb-5'>{this.state.object.name}</h1>
          <p>{this.state.object.description}</p>
        </div>
      );
    }
    return (
      <Container fluid>
        <Row>
          <Col lg md='6'>
            {pom}
          </Col>
          <Col lg md='6'>
            <Form className='mt-5 text-center'>
              <textarea
                className='texta'
                name='textArea'
                onChange={this.onChangeHandler}
              ></textarea>
              <Button
                onClick={this.onUpdHandler}
                className='btn-lg  mt-4 text-white'
                variant='primary'
              >
                Azuriraj
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userID: state.userID,
    token: state.token,
  };
};
export default connect(mapStateToProps)(AboutAdmin);
