import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import './Login.css';
import Background from './Background/Background';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import { toast } from 'react-toastify';
const formValid = ({ formErrors, ...rest }) => {
  let valid = true;
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });
  Object.values(rest).forEach((val) => {
    val === '' && (valid = false);
  });
  return valid;
};
const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

class Login extends Component {
  state = {
    email: '',
    password: '',
    formErrors: {
      email: '',
      password: '',
    },
  };

  handleClick = (e) => {
    e.preventDefault();
    if (formValid(this.state)) {
      const userData = {
        email: this.state.email,
        password: this.state.password,
      };
      axios
        .post('http://localhost:8000/api/users/login', userData)
        .then((response) => {
          console.log(response);
          this.props.onSuccess(
            response.data.user._id,
            response.data.token,
            response.data.user.role
          );
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userID', response.data.token);
          localStorage.setItem('role', response.data.user.role);
          this.props.history.push('/home');
        })
        .catch((error) => {
          console.log(error);
          this.props.onFail(error);
        });
    } else {
      console.log('NISU ISPUNJENI USLOVI');
    }
  };

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formError = { ...this.state.formErrors };

    switch (name) {
      case 'email':
        formError.email = emailRegex.test(value)
          ? ''
          : 'email adresa nije validna';
        break;
      default:
        break;
    }
    this.setState({ formErrors: formError, [name]: value });
  };
  render() {
    return (
      <div>
        <Background />
        <Form className=' loging-form  mt-5'>
          <h1 className=' text-white text-center font-weight-bold mb-4'>
            E-hotel
          </h1>
          <Form.Group controlId='formGroupEmail'>
            <Form.Label className=' text-white'>Email</Form.Label>
            <Form.Control
              onChange={this.handleChange}
              name='email'
              type='email'
              placeholder='Email'
            />
            {this.state.formErrors.email.length > 0 && (
              <span className=' text-danger'>
                {this.state.formErrors.email}
              </span>
            )}
          </Form.Group>
          <Form.Group controlId='formGroupPassword'>
            <Form.Label className=' text-white'>Lozinka</Form.Label>
            <Form.Control
              onChange={this.handleChange}
              name='password'
              type='password'
              placeholder='Lozinka'
            />
            {this.state.formErrors.password.length > 0 && (
              <span className=' text-danger'>
                {this.state.formErrors.password}
              </span>
            )}
          </Form.Group>
          <Button
            onClick={this.handleClick}
            className='btn-lg btn-block btn-primary mt-5'
          >
            Log in
          </Button>
          <div className='text-center mt-3'>
            <a className='text-white' href='/sign-up'>
              Sign up
            </a>
            <span className='p-2 text-white'>|</span>
            <a className='text-white' href='/forgot-password'>
              Forgot password
            </a>
          </div>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onSuccess: (id, token, role) => {
      toast('Uspesno ste se ulogovali', {
        type: 'success',
      });
      dispatch({
        type: actionTypes.AUTH_SUCCESS,
        id: id,
        token: token,
        role: role,
      });
    },
    onFail: (error) => {
      toast('Uneli ste nepostojeci Email ili pogresnu lozinku', {
        type: 'error',
      });
      dispatch({
        type: actionTypes.AUTH_FAIL,
        error: error,
      });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
