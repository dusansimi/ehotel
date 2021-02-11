import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import './ServicesAdmin.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import MUIDataTable from 'mui-datatables';

toast.configure();
const columns = ['ID', 'Ime', 'Cena', 'Tip'];
const options = {};

class ServicesAdmin extends Component {
  state = {
    object: null,
    id: '',
    cena: '',
    ime: '',
    tip: '',
    price: '',
  };
  componentDidMount() {
    const config = {
      headers: { Authorization: `Bearer ${this.props.token}` },
    };
    axios
      .get('http://localhost:8000/api/services', config)
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

  onUpdHandler = (event) => {
    event.preventDefault();
    if (this.state.id === '' || this.state.cena === '') {
      toast('Unesi polja', { type: 'error' });
    } else {
      const serviceData = {
        price: this.state.cena,
      };
      const config = {
        headers: { Authorization: `Bearer ${this.props.token}` },
      };
      axios
        .patch(
          'http://localhost:8000/api/services/' + this.state.id,
          serviceData,
          config
        )
        .then((response) => {
          console.log(response);
          window.location.reload(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
        .delete('http://localhost:8000/api/services/' + this.state.id, config)
        .then((response) => {
          console.log(response);
          window.location.reload(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  onChangeHandlerAdd = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  onAddHandler = (event) => {
    event.preventDefault();
    if (
      this.state.ime !== '' &&
      this.state.price !== '' &&
      this.state.tip !== ''
    ) {
      const serviceData = {
        name: this.state.ime,
        type: this.state.tip,
        price: this.state.price,
      };
      const config = {
        headers: { Authorization: `Bearer ${this.props.token}` },
      };
      axios
        .post('http://localhost:8000/api/services/', serviceData, config)
        .then((response) => {
          console.log(response);
          window.location.reload(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast('Unesi sva polja', { type: 'error' });
    }
  };

  render() {
    let pom = [];
    if (this.state.object !== null) {
      if (this.state.object.length > 0) {
        pom = this.state.object.map((el, index) => {
          return (pom[index] = [el._id, el.name, el.price, el.type]);
        });
      }
    }
    return (
      <Container fluid>
        <Row className='justify-content-center flex-column p-0'>
          <h1 className=' text-center'>Azuriraj/Izbrisi</h1>
          <Form className='mt-5 text-center formica'>
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

            <Form.Group as={Row} controlId='formPlaintextPassword'>
              <Form.Label column sm='2'>
                Cena
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  onChange={this.onChangeHandlerUpd}
                  type='number'
                  placeholder='cena'
                  name='cena'
                />
              </Col>
            </Form.Group>
            <div>
              <Button
                onClick={this.onUpdHandler}
                className='btn-lg   mt-4 text-white'
                variant='primary'
              >
                Azuriraj Cenu
              </Button>
            </div>
            <div>
              <Button
                onClick={this.onDelHandler}
                className='btn-lg  mt-4 text-white'
                variant='danger'
              >
                Izbrisi
              </Button>
            </div>
            <h1 className='text-center mb-5'>Dodaj</h1>
            <Form.Group as={Row} controlId='formPlaintextPassword'>
              <Form.Label column sm='2'>
                Ime:
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  onChange={this.onChangeHandlerAdd}
                  type='text'
                  placeholder='ime'
                  name='ime'
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='formGridRoom'>
              <Form.Label column sm='2'>
                Tip:
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  onChange={this.onChangeHandlerAdd}
                  name='tip'
                  as='select'
                  defaultValue='Choose...'
                >
                  <option>food</option>
                  <option>drinks</option>
                  <option>service</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId='formPlaintextPassword'>
              <Form.Label column sm='2'>
                Cena:
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  onChange={this.onChangeHandlerAdd}
                  type='number'
                  placeholder='cena'
                  name='price'
                />
              </Col>
            </Form.Group>
            <Button
              onClick={this.onAddHandler}
              className='btn-lg  mt-4 text-white'
              variant='primary'
            >
              Dodaj
            </Button>
          </Form>
        </Row>
        <Row className='justify-content-center mt-5'>
          <MUIDataTable
            title={'Lista Servisa'}
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
export default connect(mapStateToProps)(ServicesAdmin);
