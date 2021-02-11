import React from 'react';
import Footer from '../Footer/Footer';
import { Jumbotron, Form, Button, Row } from 'react-bootstrap';
import './Services.css';
import axios from 'axios';
import { connect } from 'react-redux';
import './Services.css';
import { toast } from 'react-toastify';

class Services extends React.Component {
	state = {
		inHotel: false,
		niz: [],
		tipusluge: 'food',
		niz2: [],
		ime: '',
		bool: false,
	};
	componentDidMount() {
		const config = {
			headers: { Authorization: `Bearer ${this.props.token}` },
		};
		axios
			.get('http://localhost:8000/api/users/me', config)
			.then((response) => {
				console.log(response);
				this.setState({ inHotel: response.data.data.doc.inHotel });
			})
			.catch((err) => {
				console.log(err);
			});
		axios
			.get('http://localhost:8000/api/services', config)
			.then((response) => {
				console.log(response);
				this.setState({ niz: response.data.data.doc });
			})
			.catch((err) => {
				console.log(err);
			});
	}
	onChangeHandlerUpd = (event) => {
		event.preventDefault();
		const { name } = event.target;
		const pom = event.target.options[event.target.selectedIndex].text;
		const config = {
			headers: { Authorization: `Bearer ${this.props.token}` },
		};
		axios
			.get('http://localhost:8000/api/services?type=' + pom, config)
			.then((response) => {
				console.log(response);
				this.setState({ niz2: response.data.data.doc });
			})
			.catch((err) => {
				console.log(err);
			});
		this.setState({ [name]: pom, bool: false });
		console.log(this.state.tipusluge);
		console.log(this.state.niz2);
	};
	onChangeName = (event) => {
		event.preventDefault();
		const { name } = event.target;
		const pom = event.target.options[event.target.selectedIndex].text;
		this.setState({ [name]: pom, bool: true });
	};
	serviceClick = (event) => {
		event.preventDefault();
		const found = this.state.niz2.find((el) => {
			return el.name === this.state.ime;
		});
		const serviceData = {
			service: found._id,
			price: found.price,
		};
		const config = {
			headers: { Authorization: `Bearer ${this.props.token}` },
		};
		axios
			.post(
				'http://localhost:8000/api/servicebookings/bookservice',
				serviceData,
				config
			)
			.then((response) => {
				console.log(response);
				toast('Uspesno ste rezervisali uslugu', { type: 'success' });
				this.setState({
					inHotel: true,
					niz2: [],
					ime: '',
					bool: false,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};
	render() {
		let pom = null;
		if (this.state.inHotel === true) {
			pom = (
				<Form.Group controlId="formGridTipi">
					<Form.Label column sm="2">
						Tip usluge
					</Form.Label>
					<div className="align-self-center">
						<Form.Control
							onChange={this.onChangeHandlerUpd}
							name="tipusluge"
							as="select"
							defaultValue="Choose..."
						>
							<option>food</option>
							<option>drinks</option>
							<option>service</option>
						</Form.Control>
					</div>
				</Form.Group>
			);
		}
		let pom2 = null;
		if (this.state.niz2.length > 0) {
			const pom3 = this.state.niz2.map((el) => {
				return <option key={el._id}>{el.name}</option>;
			});
			console.log(pom3);
			pom2 = (
				<Form.Group controlId="formGridTipi">
					<Form.Label column sm="2">
						Ime usluge
					</Form.Label>
					<div className="align-self-center">
						<Form.Control
							onChange={this.onChangeName}
							name="ime"
							as="select"
							defaultValue="Choose..."
						>
							{pom3}
						</Form.Control>
					</div>
				</Form.Group>
			);
		}
		let pom3 = null;
		if (this.state.bool === true) {
			const found = this.state.niz2.find((el) => {
				return el.name === this.state.ime;
			});
			console.log(found);
			console.log(this.state.ime);
			pom3 = (
				<div>
					<h6>Cena:{' ' + found.price}</h6>
					<Button
						onClick={this.serviceClick}
						className="btn-lg"
						variant="warning"
					>
						Rezervisi servis
					</Button>
				</div>
			);
		}
		return (
			<div>
				<Jumbotron fluid>
					<h1 className="text-center mb-5">Services</h1>
					{this.state.inHotel === false ? (
						<p className="text-center">Vasa rezervacija jos nije pocela</p>
					) : null}
				</Jumbotron>
				<div className="text-center container justify-content-center">
					{pom}
					{pom2}
					{pom3}
				</div>

				<div className="margina"></div>
				<Footer />
			</div>
		);
	}
}
const mapStatetoProps = (state) => {
	return {
		token: state.token,
		id: state.userID,
	};
};

export default connect(mapStatetoProps)(Services);
