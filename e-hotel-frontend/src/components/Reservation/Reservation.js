import React, { Component } from 'react';
import { Jumbotron, Container, Button, Row, Col, Form } from 'react-bootstrap';
import './Reservation.css';
import Footer from '../Footer/Footer';
import axios from 'axios';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import StripeCheckout from 'react-stripe-checkout';
toast.configure();

class Reservation extends Component {
	state = {
		datumod: null,
		datumdo: null,
		tipsobe: 'jednokrevetna',
		status: null,
		roomID: '',
	};
	onClickHandler = (event) => {
		event.preventDefault();
		if (this.props.userID === null) {
			this.props.history.push('/log-in');
		}
		if (this.state.datumod !== null && this.state.datumdo !== null) {
			const bookData = {
				type: this.state.tipsobe,
				startDate: this.state.datumod,
				endDate: this.state.datumdo,
				book: false,
			};
			const config = {
				headers: { Authorization: `Bearer ${this.props.token}` },
			};
			axios
				.post(
					'http://localhost:8000/api/roombookings/findandbook',
					bookData,
					config
				)
				.then((response) => {
					console.log(response);
					this.setState({
						status: response.data.status,
						roomID: response.data.data.data,
					});
					console.log(this.state.status);
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			console.log('UNESI DATUM');
		}
	};

	onChangeHandler = (event) => {
		let pom = null;
		if (event.target.name === 'tipsobe') {
			pom = event.target.options[event.target.selectedIndex].text;
		}
		if (event.target.name === 'datumod') {
			const pom2 = event.target.value;
			if (event.target.value === '') {
				pom = event.target.value;
			} else {
				const pom3 = pom2.split('-');
				pom = pom3[2].concat('-').concat(pom3[1]).concat('-').concat(pom3[0]);
			}
		}
		if (event.target.name === 'datumdo') {
			const pom2 = event.target.value;
			if (event.target.value === '') {
				pom = event.target.value;
			} else {
				const pom3 = pom2.split('-');
				pom = pom3[2].concat('-').concat(pom3[1]).concat('-').concat(pom3[0]);
			}
		}
		console.log(event.target.name);
		console.log(pom);
		this.setState({ [event.target.name]: pom });
		console.log(this.state.tipsobe);
		console.log(this.state.datumod);
		console.log(this.state.datumdo);
	};
	handleToken = (token) => {
		const info = {
			roomId: this.state.roomID,
			startDate: this.state.datumod,
			endDate: this.state.datumdo,
		};
		const Data = {
			info: info,
			token: token,
		};
		const config = {
			headers: { Authorization: `Bearer ${this.props.token}` },
		};
		axios
			.post(
				'http://localhost:8000/api/roombookings/checkout-session',
				Data,
				config
			)
			.then((response) => {
				const { status } = response.data;
				if (status === 'success') {
					toast('Uspesno ste rezervisali sobu', { type: 'success' });
					window.location.reload(false);
				} else {
					toast('Rezervacija neuspela', { type: 'error' });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	render() {
		let statusRender = null;
		if (this.state.status === 'sucess') {
			statusRender = (
				<Jumbotron className="text-center ">
					<h1 className=" t text-center text-capitalize mb-5">
						Ima dostupnih soba
					</h1>
					<StripeCheckout
						stripeKey="pk_test_51GyabHBGK9WstSuW9dWd9XBXu7KDaiY8wCwES70r9N9hMrV8ZSySBogwEOSSIbxIpF2voRy5gE6jeGfeIaBK0kTM00ScBSs0xi"
						token={this.handleToken}
					/>
				</Jumbotron>
			);
		}
		if (this.state.status === 'fail') {
			statusRender = (
				<Jumbotron className="text-center">
					<h1 className=" t2 text-center text-capitalize">
						Nema dostupnih soba
					</h1>
				</Jumbotron>
			);
		}
		return (
			<Container className="p-0 m-0 text-center" fluid>
				<Row>
					<Col xs lg sm md="12">
						<Jumbotron>
							<h1 className="text-center text-capitalize">SOBE</h1>
						</Jumbotron>
					</Col>
				</Row>
				<Row>
					<Col xs lg sm md="12">
						<Form className="text-center  loging-form">
							<Form.Group className="text-center" controlId=" formBasicDate">
								<Form.Label>Datum od</Form.Label>
								<Form.Control
									onChange={this.onChangeHandler}
									name="datumod"
									type="date"
									placeholder="Datum od"
								></Form.Control>
							</Form.Group>
							<Form.Group controlId=" formBasicDate">
								<Form.Label>Datum do</Form.Label>
								<Form.Control
									onChange={this.onChangeHandler}
									name="datumdo"
									type="date"
									placeholder="Datum do"
								></Form.Control>
							</Form.Group>
							<Form.Group as={Col} controlId="formGridRoom">
								<Form.Label>Tip sobe</Form.Label>
								<Form.Control
									onChange={this.onChangeHandler}
									name="tipsobe"
									as="select"
									defaultValue="Choose..."
								>
									<option>jednokrevetna</option>
									<option>dvokrevetna</option>
									<option>trokrevetna</option>
									<option>cetvorokrevetna</option>
									<option>apartman</option>
									<option>lux</option>
								</Form.Control>
							</Form.Group>
						</Form>
					</Col>
				</Row>
				<Button
					onClick={this.onClickHandler}
					className="btn-lg btn-warning dugme"
				>
					Proveri dostupnost
				</Button>
				{statusRender}
				<Footer />
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

export default connect(mapStateToProps)(Reservation);
