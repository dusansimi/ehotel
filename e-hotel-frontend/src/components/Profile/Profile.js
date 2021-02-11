import React from 'react';
import {
	Container,
	Row,
	Col,
	Button,
	Image,
	Form,
	Modal,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import slika from '../../assets/images/profile.png';
import axios from 'axios';
import Footer from '../Footer/Footer';
import './Profile.css';
import { toast } from 'react-toastify';
import * as actionTypes from '../../store/actions/actionTypes';

const emailRegex = RegExp(
	/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

class Profile extends React.Component {
	state = {
		name: '',
		role: '',
		inHotel: false,
		email: '',
		emailError: true,
		newEmail: '',
		key: null,
		changeEmail: false,
		changePassword: false,
		show: false,
		oldPass: '',
		newPass: '',
		conPass: '',
		oldPassError: true,
		newPassError: true,
		conPassError: true,
	};
	componentDidMount() {
		const config = {
			headers: { Authorization: `Bearer ${this.props.token}` },
		};
		axios
			.get('http://localhost:8000/api/users/me', config)
			.then((response) => {
				console.log(response);
				this.setState({
					name: response.data.data.doc.name,
					email: response.data.data.doc.email,
					role: response.data.data.doc.role,
					inHotel: response.data.data.doc.inHotel,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	preuzmiKljuc = (event) => {
		const config = {
			headers: { Authorization: `Bearer ${this.props.token}` },
		};
		axios
			.get('http://localhost:8000/api/roombookings/get-key', config)
			.then((response) => {
				console.log(response);
				if (response.data.status === 'fail') {
					toast('Vasa rezervacija ne postoji ili ne pocinje danas', {
						type: 'error',
					});
				}
				if (response.data.status === 'success') {
					this.setState({ key: response.data.key, inHotel: true });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	onEmailLink = (event) => {
		event.preventDefault();
		this.setState({ changeEmail: !this.state.changeEmail });
	};
	promeniMailHandler = (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		let er = { ...this.state.emailError };
		if (name === 'newEmail') {
			er = emailRegex.test(value) ? false : true;
			console.log(er);
			this.setState({ emailError: er });
		}
		console.log(name);
		console.log(value);

		this.setState({ [name]: value });
	};
	promeniMail = (event) => {
		if (this.state.emailError === false) {
			const config = {
				headers: { Authorization: `Bearer ${this.props.token}` },
			};
			const userData = {
				email: this.state.newEmail,
			};
			axios
				.patch('http://localhost:8000/api/users/updateMe', userData, config)
				.then((response) => {
					toast('Promenjena email adresa', { type: 'success' });
					this.setState({
						email: response.data.data.user.email,
						changeEmail: false,
					});
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			toast('Nevalidna email adresa!', { type: 'error' });
		}
	};
	handleClose = () => {
		this.setState({ show: false });
	};
	handleShow = () => {
		this.setState({ show: true });
	};
	onModalChange = (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		if (name === 'oldPass') {
			let er = value.length > 7 ? false : true;
			this.setState({ oldPassError: er, [name]: value });
		} else if (name === 'newPass') {
			let er = value.length > 7 ? false : true;
			this.setState({ newPassError: er, [name]: value });
		} else {
			let er = value === this.state.newPass ? false : true;
			this.setState({ conPassError: er, [name]: value });
		}
	};
	onModalSubmit = () => {
		if (
			this.state.oldPassError ||
			this.state.newPassError ||
			this.state.conPassError
		) {
			toast('Lozinka mora da ima vise od 8 karaktera', { type: 'error' });
		} else {
			const config = {
				headers: { Authorization: `Bearer ${this.props.token}` },
			};
			const userData = {
				passwordOld: this.state.oldPass,
				password: this.state.newPass,
				passwordConfirm: this.state.conPass,
			};
			axios
				.patch(
					'http://localhost:8000/api/users/updatePassword',
					userData,
					config
				)
				.then((response) => {
					console.log(response);
					toast('Uspesno ste promenili lozinku', { type: 'success' });
					localStorage.removeItem('token');
					localStorage.setItem('token', response.data.token);
					this.props.onPasschange(response.data.token);
					this.setState({ show: false });
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
	deleteAcc = () => {
		const config = {
			headers: { Authorization: `Bearer ${this.props.token}` },
		};
		axios
			.delete('http://localhost:8000/api/users/deleteMe', config)
			.then((response) => {
				console.log(response);
				this.props.onDelete();
				this.props.history.push('/home');
			})
			.catch((err) => {
				console.log(err);
			});
	};
	render() {
		console.log(this.state);
		if (this.state.key === null) {
		}
		let pom = null;
		if (this.state.changeEmail === false) {
			pom = <h6>{this.state.email}</h6>;
		} else {
			pom = (
				<Form>
					<Form.Group controlId="formBasicEmail">
						<Form.Control
							type="email"
							defaultValue={this.state.email}
							name="newEmail"
							onChange={this.promeniMailHandler}
						/>
					</Form.Group>
				</Form>
			);
		}
		return (
			<Container className="m-0 p-0" fluid>
				<Row>
					<Col lg="2">
						<Image
							className="mt-4 ml-5"
							roundedCircle
							src={slika}
							height="130"
							width="130"
						></Image>
						<button onClick={this.handleShow} className="mt-3 ml-5 kaolink">
							Change password
						</button>
					</Col>
					<Col lg="7">
						<h1>{this.state.name}</h1>
						<h6 className="mt-4 ">Email: </h6>
						{pom}
						<button onClick={this.onEmailLink} className="kaolink">
							{this.state.changeEmail === false ? 'Change email' : 'odustani'}
						</button>
						<button
							onClick={this.promeniMail}
							className="kaolink ml-4"
							hidden={!this.state.changeEmail}
						>
							submit
						</button>
						<h6 className="mt-4">Uloga: </h6>
						<h6>
							{this.state.role.charAt(0).toUpperCase() +
								this.state.role.slice(1)}
						</h6>
						<h6 className="mt-4">U hotelu?: </h6>

						<h6>
							{this.state.inHotel === false
								? 'Korisnik nije u hotelu'
								: 'Korisnik je u hotelu'}
						</h6>
						<h6 className="mt-4">Kljuc:</h6>
						<h6>
							{this.state.key === null
								? 'Nemate kljuc za sobu'
								: 'Vas kljuc je: ' + this.state.key}
						</h6>
					</Col>
					<Col lg="3">
						<h2 className="mt-5 crn">O kljucu</h2>
						<p className="mt-5">
							Kljuc vam je potreban da udjete u sobu.Pritiskom na dugme koje se
							nalazi ispod preuzimate kljuc. Kljuc je nemoguce preuzeti ukoliko
							vasa rezervacija jos nije pocela. Zelimo vam prijatan boravak u
							nasem hotelu
						</p>
						<Button
							onClick={this.preuzmiKljuc}
							className="mt-4"
							variant="warning"
						>
							Preuzmi kljuc
						</Button>
						<h2 className="mb-5 mt-5 crn">Obrisi nalog</h2>
						<Button
							onClick={this.deleteAcc}
							variant="danger"
							className="btn-lg"
						>
							Obrisi nalog
						</Button>
					</Col>
				</Row>
				<div className="margina"></div>
				<Footer />
				<Modal
					show={this.state.show}
					onHide={this.handleClose}
					backdrop="static"
					keyboard={false}
				>
					<Modal.Header closeButton>
						<Modal.Title>Change password</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group as={Row} controlId="formPlaintextEmail">
								<Form.Label column sm="2">
									Old Password
								</Form.Label>
								<Col sm="10">
									<Form.Control
										name="oldPass"
										type="password"
										placeholder="old password"
										onChange={this.onModalChange}
									/>
								</Col>
							</Form.Group>

							<Form.Group as={Row} controlId="formPlaintextPassword">
								<Form.Label column sm="2">
									New Password
								</Form.Label>
								<Col sm="10">
									<Form.Control
										type="password"
										placeholder="Password"
										name="newPass"
										onChange={this.onModalChange}
									/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="formPlaintextPassword">
								<Form.Label column sm="2">
									Confirm Password
								</Form.Label>
								<Col sm="10">
									<Form.Control
										type="password"
										placeholder="Password"
										name="conPass"
										onChange={this.onModalChange}
									/>
								</Col>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button onClick={this.onModalSubmit} variant="primary">
							Submit
						</Button>
					</Modal.Footer>
				</Modal>
			</Container>
		);
	}
}

const mapStatetoProps = (state) => {
	return {
		token: state.token,
		id: state.userID,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onPasschange: (token) =>
			dispatch({
				type: actionTypes.NEW_PASS,
				token: token,
			}),
		onDelete: () =>
			dispatch({
				type: actionTypes.AUTH_LOGOUT,
			}),
	};
};
export default connect(mapStatetoProps, mapDispatchToProps)(Profile);
