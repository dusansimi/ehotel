import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import './UserAdmin.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import MUIDataTable from 'mui-datatables';

const columns = ['ID', 'Ime', 'Role', 'Email'];
toast.configure();
const options = {};

class UserAdmin extends Component {
  state = {
    object: [],
    roleAdmin: '',
    id: '',
  };
  componentDidMount() {
    const config = {
      headers: { Authorization: `Bearer ${this.props.token}` },
    };
    axios
      .get('http://localhost:8000/api/users', config)
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
    if (this.state.roleAdmin === '' || this.state.id === '') {
      toast('Unesi sva polja', {
        type: 'error',
      });
    } else {
      const userData = {
        role: this.state.roleAdmin,
      };
      const config = {
        headers: { Authorization: `Bearer ${this.props.token}` },
      };
      axios
        .patch(
          'http://localhost:8000/api/users/' + this.state.id,
          userData,
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
      toast('Unesi id sobe', {
        type: 'error',
      });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${this.props.token}` },
      };
      axios
        .delete('http://localhost:8000/api/users/' + this.state.id, config)
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
    if (this.state.object.length > 0) {
      pom = this.state.object.map((el, index) => {
        return (pom[index] = [el._id, el.name, el.role, el.email]);
      });
    }
    return (
      <Container fluid>
        <Row className='justify-content-center'>
          <Form className='mt-5 text-center'>
            <h1 className='mb-5'>Promeni role</h1>
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
            <Form.Group as={Row} controlId='formPlaintextEmail'>
              <Form.Label column sm='2'>
                Role:
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  type='text'
                  onChange={this.onChangeHandlerUpd}
                  name='roleAdmin'
                />
              </Col>
            </Form.Group>
            <Button
              onClick={this.onUpdHandler}
              className='btn-lg mr-5  mt-4 text-white'
              variant='primary'
            >
              Azuriraj
            </Button>
            <Button
              onClick={this.onDelHandler}
              className='btn-lg ml-5 mt-4'
              variant='danger'
            >
              Izbrisi
            </Button>
          </Form>
        </Row>
        <Row className='justify-content-center mt-5'>
          <MUIDataTable
            title={'Lista Korisnika'}
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
export default connect(mapStateToProps)(UserAdmin);
