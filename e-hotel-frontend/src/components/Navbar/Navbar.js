import React from 'react';
import { Nav } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import Logo from '../Logo/Logo';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import Aux from '../../Wrapper';

class Toolbar extends React.Component {
  render() {
    const idrender = this.props.id;
    let pomid = null;
    if (idrender) {
      pomid = (
        <Aux>
          <NavLink className='nav-link' to='/services'>
            Services
          </NavLink>
          <NavLink className='nav-link' to='/profile'>
            Profile
          </NavLink>
          <NavLink
            onClick={this.props.onLogout}
            className='nav-link'
            to='/log-in'
          >
            Log out
          </NavLink>
        </Aux>
      );
    } else {
      pomid = (
        <Aux>
          <NavLink className='nav-link' to='/log-in'>
            Log in
          </NavLink>
          <NavLink className='nav-link' to='/sign-up'>
            Sign up
          </NavLink>
        </Aux>
      );
    }
    const rolerender = this.props.role;
    let pom = (
      <Navbar
        collapseOnSelect
        expand='lg'
        sticky='top'
        bg='dark'
        variant='dark'
      >
        <Navbar.Brand>
          <NavLink to='/home'>
            <Logo />
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav>
            <NavLink className='nav-link' to='/home'>
              Home
            </NavLink>
            <NavLink className='nav-link' to='/reservation'>
              Reservation
            </NavLink>
            {pomid}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
    if (rolerender === 'admin') {
      pom = (
        <Navbar
          collapseOnSelect
          expand='lg'
          sticky='top'
          bg='dark'
          variant='dark'
        >
          <Navbar.Brand>
            <NavLink to='/home'>
              <Logo />
            </NavLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav>
              <NavLink className='nav-link' to='/usersadmin'>
                Users
              </NavLink>
              <NavLink className='nav-link' to='/roomsadmin'>
                Rooms
              </NavLink>
              <NavLink className='nav-link' to='/servicesadmin'>
                Services
              </NavLink>
              <NavLink className='nav-link' to='/aboutadmin'>
                About
              </NavLink>
              <NavLink className='nav-link' to='/reviewsadmin'>
                Reviews
              </NavLink>
              <NavLink
                onClick={this.props.onLogout}
                className='nav-link'
                to='/logout'
              >
                Log out
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
    if (rolerender === 'staff') {
      pom = (
        <Navbar
          collapseOnSelect
          expand='lg'
          sticky='top'
          bg='dark'
          variant='dark'
        >
          <Navbar.Brand>
            <NavLink to='/staff'>
              <Logo />
            </NavLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav>
              <NavLink className='nav-link' to='/staff'>
                Staff
              </NavLink>
              <NavLink
                onClick={this.props.onLogout}
                className='nav-link'
                to='/log-in'
              >
                Log out
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
    return <div> {pom}</div>;
  }
}
const mapStateToProps = (state) => {
  return {
    id: state.userID,
    role: state.role,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch({ type: actionTypes.AUTH_LOGOUT }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
