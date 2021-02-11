import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import './Reviews.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import MUIDataTable from 'mui-datatables';

const columns = ['ID', 'Ocena', 'Opis'];
const options = {};
toast.configure();

class ReviewsAdmin extends Component {
  state = {
    object: null,
    id: '',
  };
  componentDidMount() {
    axios
      .get('http://localhost:8000/api/reviews')
      .then((response) => {
        console.log(response);
        this.setState({ object: response.data.data.doc });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onChangeHandlerUpd = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  onDelHandler = (event) => {
    event.preventDefault();
    if (this.state.id === '') {
      toast('Unesi id', { type: 'error' });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${this.props.token}` },
      };
      axios
        .delete('http://localhost:8000/api/reviews/' + this.state.id, config)
        .then((response) => {
          console.log(response);
          window.location.reload(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  render() {
    let pom = [];
    if (this.state.object !== null) {
      if (this.state.object.length > 0) {
        pom = this.state.object.map((el, index) => {
          return (pom[index] = [el._id, el.rating, el.review]);
        });
      }
    }
    return (
      <Container fluid>
        <Row className='justify-content-center'>
          <Form className='mt-5 text-center'>
            <h1 className='mb-5'>Obrisi Review</h1>
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              <Form.Label column sm='2'>
                ID:
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  type='text'
                  onChange={this.onChangeHandlerUpd}
                  name='id'
                />
              </Col>
            </Form.Group>
            <Button
              onClick={this.onDelHandler}
              className='btn-lg  mt-4 text-white'
              variant='danger'
            >
              Delete
            </Button>
          </Form>
        </Row>
        <Row className='justify-content-center mt-5'>
          <MUIDataTable
            title={'Lista Recenzija'}
            data={pom}
            columns={columns}
            options={options}
          />
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
export default connect(mapStateToProps)(ReviewsAdmin);
