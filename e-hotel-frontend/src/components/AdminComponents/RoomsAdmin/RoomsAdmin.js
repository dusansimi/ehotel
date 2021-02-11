import React, { Component } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MUIDataTable from 'mui-datatables';

const columns = ['ID', 'BrojSobe', 'Tip'];
toast.configure();
const options = {};

class RoomsAdmin extends Component {
  state = {
    arr: [],
    id: '',
    numberRoom: null,
    tipsobe: '',
    tipsobeDodaj: '',
    numberFloor: null,
  };

  componentDidMount() {
    const config = {
      headers: { Authorization: `Bearer ${this.props.token}` },
    };
    axios
      .get('http://localhost:8000/api/rooms?sort=number', config)
      .then((response) => {
        console.log(response);
        this.setState({ arr: response.data.data.doc });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  onChangeHandlerUpd = (event) => {
    event.preventDefault();
    const { name } = event.target;
    let pom = null;
    if (name === 'id') {
      pom = event.target.value;
    } else if (name === 'numberRoom') {
      pom = event.target.value;
      if (event.target.value === '') {
        pom = null;
      }
    } else {
      pom = event.target.options[event.target.selectedIndex].text;
    }
    console.log(pom);

    this.setState({ [name]: pom });
  };
  onUpdHandler = (event) => {
    event.preventDefault();
    console.log(this.state.id);
    if (this.state.id === '') {
      toast('Unesi id sobe', {
        type: 'error',
      });
    } else {
      console.log(this.state.numberRoom);
      if (this.state.numberRoom !== null || this.state.tipsobe !== '') {
        let roomData = null;
        if (this.state.numberRoom !== null && this.state.tipsobe !== '') {
          roomData = {
            type: this.state.tipsobe,
            number: this.state.numberRoom,
          };
        } else if (
          this.state.numberRoom !== null &&
          this.state.tipsobe === ''
        ) {
          roomData = {
            number: this.state.numberRoom,
          };
        } else {
          roomData = {
            type: this.state.tipsobe,
          };
        }
        const config = {
          headers: { Authorization: `Bearer ${this.props.token}` },
        };
        axios
          .patch(
            'http://localhost:8000/api/rooms/' + this.state.id,
            roomData,
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
        toast('Unesi polje koje zelis da promenis', {
          type: 'error',
        });
      }
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
        .delete('http://localhost:8000/api/rooms/' + this.state.id, config)
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
    const { name } = event.target;
    let pom = null;
    if (name === 'tipsobeDodaj') {
      pom = event.target.options[event.target.selectedIndex].text;
    } else {
      pom = event.target.value;
      if (event.target.value === '') {
        pom = null;
      }
    }
    this.setState({ [name]: pom });
  };
  onAddHandler = (event) => {
    event.preventDefault();
    if (this.state.numberFloor !== null && this.state.tipsobeDodaj !== '') {
      const config = {
        headers: { Authorization: `Bearer ${this.props.token}` },
      };
      const roomData = {
        type: this.state.tipsobeDodaj,
        floor: this.state.numberFloor,
      };
      axios
        .post('http://localhost:8000/api/rooms', roomData, config)
        .then((response) => {
          console.log(response);
          window.location.reload(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast('Unesi sva polja', {
        type: 'error',
      });
    }
  };
  render() {
    let pom = [];
    if (this.state.arr !== null && this.state.arr.length > 0) {
      pom = this.state.arr.map((el, index) => {
        return (pom[index] = [el._id, el.number, el.type]);
      });
    }
    return (
      <Container fluid>
        <Row className='justify-content-center flex-column'>
          <h1 className='mt-5 text-center'>Azuriraj/Izbrisi</h1>
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
                Room
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  onChange={this.onChangeHandlerUpd}
                  type='number'
                  placeholder='broj sobe'
                  name='numberRoom'
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='formGridRoom'>
              <Form.Label column sm='2'>
                Type
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  onChange={this.onChangeHandlerUpd}
                  name='tipsobe'
                  as='select'
                  defaultValue='Choose...'
                >
                  <option>jednokrevetna</option>
                  <option>dvokrevetna</option>
                  <option>trokrevetna</option>
                  <option>cetvorokrevetna</option>
                  <option>apartman</option>
                  <option>lux</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Button
              onClick={this.onUpdHandler}
              className='btn-lg mr-5 mt-4 text-white'
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
          <h1 className='mt-5 text-center'>Dodaj</h1>
          <Form className='mt-5 text-center formica'>
            <Form.Group as={Row} controlId='formPlaintextPassword'>
              <Form.Label column sm='2'>
                Floor
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  onChange={this.onChangeHandlerAdd}
                  type='number'
                  placeholder='broj sprata'
                  name='numberFloor'
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId='formGridRoom'>
              <Form.Label column sm='2'>
                Type
              </Form.Label>
              <Col sm='10'>
                <Form.Control
                  onChange={this.onChangeHandlerAdd}
                  name='tipsobeDodaj'
                  as='select'
                  defaultValue='Choose...'
                >
                  <option>jednokrevetna</option>
                  <option>dvokrevetna</option>
                  <option>trokrevetna</option>
                  <option>cetvorokrevetna</option>
                  <option>apartman</option>
                  <option>lux</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Button
              onClick={this.onAddHandler}
              className='btn-lg  mt-4'
              variant='primary'
            >
              Dodaj
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
export default connect(mapStateToProps)(RoomsAdmin);
