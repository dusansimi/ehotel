import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import './Signup.css';
import Background from '../Login/Background/Background';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

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
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		passwordConfirm: '',
		formErrors: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			passwordConfirm: '',
		},
	};

	handleClick = (e) => {
		e.preventDefault();
		if (formValid(this.state)) {
			const name = this.state.firstName.concat(' ').concat(this.state.lastName);
			const userData = {
				name: name,
				email: this.state.email,
				password: this.state.password,
				passwordConfirm: this.state.passwordConfirm,
			};
			console.log(userData);
			axios
				.post('http://localhost:8000/api/users/signup', userData)
				.then((response) => {
					console.log(response);
					console.log(response.data.user._id);
					console.log(response.data.token);
					console.log(response.data.user.role);
					this.props.onSuccess(
						response.data.user._id,
						response.data.token,
						response.data.user.role
					);
					localStorage.setItem('token', response.data.user._id);
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
			case 'firstName':
				formError.firstName =
					value.length > 1 ? '' : 'ovo polje ne sme ostati prazno';
				break;
			case 'lastName':
				formError.lastName =
					value.length > 1 ? '' : 'ovo polje ne sme ostati prazno';
				break;
			case 'email':
				formError.email = emailRegex.test(value)
					? ''
					: 'unesena email adresa nije validna';
				break;
			case 'password':
				formError.password =
					value.length > 7 ? '' : 'molimo vas unesite najmanje 8 karaktera';
				break;
			case 'passwordConfirm':
				formError.passwordConfirm =
					value === this.state.password ? '' : 'lozinke se ne poklapaju';
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
				<Form className=" loging-form  mt-5">
					<h1 className=" text-white text-center font-weight-bold mb-4">
						E-hotel
					</h1>
					<Form.Group controlId=" formGroupFirstName">
						<Form.Label className=" text-white">Ime</Form.Label>
						<Form.Control
							onChange={this.handleChange}
							name="firstName"
							type="text"
							placeholder="Ime"
						/>
						{this.state.formErrors.firstName.length > 0 && (
							<span className=" text-danger">
								{this.state.formErrors.firstName}
							</span>
						)}
					</Form.Group>
					<Form.Group controlId="formGroupLastName">
						<Form.Label className=" text-white">Prezime</Form.Label>
						<Form.Control
							onChange={this.handleChange}
							name="lastName"
							type="text"
							placeholder="Prezime"
						/>
						{this.state.formErrors.lastName.length > 0 && (
							<span className=" text-danger">
								{this.state.formErrors.lastName}
							</span>
						)}
					</Form.Group>
					<Form.Group controlId="formGroupEmail">
						<Form.Label className=" text-white">Email</Form.Label>
						<Form.Control
							onChange={this.handleChange}
							name="email"
							type="email"
							placeholder="Email"
						/>
						{this.state.formErrors.email.length > 0 && (
							<span className=" text-danger">
								{this.state.formErrors.email}
							</span>
						)}
					</Form.Group>
					<Form.Group controlId="formGroupPassword">
						<Form.Label className=" text-white">Lozinka</Form.Label>
						<Form.Control
							onChange={this.handleChange}
							name="password"
							type="password"
							placeholder="Lozinka"
						/>
						{this.state.formErrors.password.length > 0 && (
							<span className=" text-danger">
								{this.state.formErrors.password}
							</span>
						)}
					</Form.Group>
					<Form.Group controlId="formGroupPassword">
						<Form.Label className=" text-white">Potvrda lozinke</Form.Label>
						<Form.Control
							onChange={this.handleChange}
							name="passwordConfirm"
							type="password"
							placeholder="Potvrda lozinke"
						/>
						{this.state.formErrors.passwordConfirm.length > 0 && (
							<span className=" text-danger">
								{this.state.formErrors.passwordConfirm}
							</span>
						)}
					</Form.Group>
					<Button
						onClick={this.handleClick}
						className="btn-lg btn-block btn-primary mt-5"
					>
						Sign up
					</Button>
					<div className="text-center mt-3">
						<a className="text-white" href="/login">
							Already have an account?
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
		onSuccess: (id, token, role) =>
			dispatch({
				type: actionTypes.AUTH_SUCCESS,
				id: id,
				token: token,
				role: role,
			}),
		onFail: (error) => {
			dispatch({
				type: actionTypes.AUTH_FAIL,
				error: error,
			});
		},
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
