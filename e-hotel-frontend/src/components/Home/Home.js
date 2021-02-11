import React from 'react';
import {
  Container,
  Jumbotron,
  Button,
  Row,
  Col,
  Image,
  Form,
} from 'react-bootstrap';
import './Home.css';
import Offers from './Offers/Offers';
import Info from './Info/Info';
import { NavLink } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Axios from 'axios';
import slika from '../../assets/images/profile.png';
import { connect } from 'react-redux';
import ReactStars from 'react-rating-stars-component';
import { toast } from 'react-toastify';

class Home extends React.Component {
  state = {
    niz: [],
    recenzija: '',
    rating: null,
  };
  componentDidMount() {
    Axios.get('http://localhost:8000/api/reviews')
      .then((response) => {
        console.log(response);
        this.setState({ niz: response.data.data.doc });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  onClickRev = () => {
    if (this.state.recenzija === '' || this.state.rating === null) {
      toast('Molimo Vas Unesite recenziju i ocenu', { type: 'error' });
    } else {
      const config = {
        headers: { Authorization: `Bearer ${this.props.token}` },
      };
      const data = {
        review: this.state.recenzija,
        rating: this.state.rating,
      };
      Axios.post('http://localhost:8000/api/reviews', data, config)
        .then((response) => {
          console.log(response);
          window.location.reload(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  ratingChanged = (newRating) => {
    this.setState({ rating: newRating });
    console.log(newRating);
  };
  render() {
    let pom = [];
    if (this.state.niz !== null && this.state.niz.length > 0) {
      pom = this.state.niz.map((el, index) => {
        return (pom[index] = (
          <Container key={el._id} className='border kon mb-5 mt-5'>
            <Row>
              <Col lg='2'>
                <Image
                  className='mt-4 ml-5'
                  roundedCircle
                  src={slika}
                  height='60'
                  width='60'
                ></Image>
                <ReactStars
                  className='ml-3'
                  count={5}
                  value={el.rating}
                  size={24}
                  color2={'#ffd700'}
                />
              </Col>
              <Col lg='10'>
                <h3 className='boja mt-3'>{el.user.name}</h3>
                <p>{el.review}</p>
              </Col>
            </Row>
          </Container>
        ));
      });
    }
    return (
      <Container fluid className='p-0 con'>
        <Jumbotron fluid className='c'></Jumbotron>
        <hr />
        <h1 className='text-center'>Šta nudimo?</h1>
        <Offers />
        <br />
        <hr />
        <Jumbotron className='text-center'>
          <h1 className='text-center mb-5'>Proverite dostupnost soba</h1>
          <Button className='btn-lg' variant='warning'>
            <NavLink className='text-white' to='/reservation'>
              Proveri
            </NavLink>
          </Button>
        </Jumbotron>
        <Info />
        <Jumbotron className='text-center'>
          <h1 className='text-center mb-5'>
            Da bi ste koristili nase usluge morate biti korisnici
          </h1>
          <span>
            <Button className='btn-lg mr-5 ' variant='warning'>
              <NavLink className='text-white' to='/log-in'>
                Log in
              </NavLink>
            </Button>
            <Button className='btn-lg ml-5 ' variant='warning'>
              <NavLink className='text-white' to='/sign-up'>
                Sign up
              </NavLink>
            </Button>
          </span>
        </Jumbotron>
        <Form className='formica'>
          <Form.Group controlId='formPlaintextEmail'>
            <Form.Control
              onChange={this.onChange}
              as='textarea'
              name='recenzija'
              type='text'
            />
          </Form.Group>
          <ReactStars
            count={5}
            onChange={this.ratingChanged}
            size={24}
            value={this.state.rating}
            color2={'#ffd700'}
          />
          <Button
            variant='warning'
            onClick={this.onClickRev}
            className='text-white'
          >
            Postavi recenziju
          </Button>
        </Form>
        {pom}
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

export default connect(mapStateToProps)(Home);
