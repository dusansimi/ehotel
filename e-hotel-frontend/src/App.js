import React, { Component } from 'react';
import './App.css';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Reservation from './components/Reservation/Reservation';
import Services from './components/Services/Services';
import RoomsAdmin from './components/AdminComponents/RoomsAdmin/RoomsAdmin';
import AboutAdmin from './components/AdminComponents/AboutAdmin/AboutAdmin';
import UserAdmin from './components/AdminComponents/UsersAdmin/UserAdmin';
import ReviewsAdmin from './components/AdminComponents/ReviewsAdmin/ReviewsAdmin';
import ServicesAdmin from './components/AdminComponents/ServicesAdnim/ServicesAdmin';
import Profile from './components/Profile/Profile';
import Staff from './components/Staff/staff';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    let pom = (
      <Switch>
        <Route path='/log-in' exact component={Login} />
        <Route path='/sign-up' exact component={Signup} />
        <Route path='/home' exact component={Home} />
        <Route path='/reservation' exact component={Reservation} />
        <Redirect to='/home' />
      </Switch>
    );
    if (this.props.token !== null) {
      if (this.props.role === 'user') {
        pom = (
          <Switch>
            <Route path='/profile' exact component={Profile} />
            <Route path='/services' exact component={Services} />
            <Route path='/home' exact component={Home} />
            <Route path='/reservation' exact component={Reservation} />
            <Redirect to='/home' />
          </Switch>
        );
      } else if (this.props.role === 'staff') {
        pom = (
          <Switch>
            <Route path='/staff' exact component={Staff} />
            <Redirect to='/staff' />
          </Switch>
        );
      } else {
        pom = (
          <Switch>
            <Route path='/roomsadmin' exact component={RoomsAdmin} />
            <Route path='/aboutadmin' exact component={AboutAdmin} />
            <Route path='/usersadmin' exact component={UserAdmin} />
            <Route path='/reviewsadmin' exact component={ReviewsAdmin} />
            <Route path='/servicesadmin' exact component={ServicesAdmin} />
            <Redirect to='/usersadmin' />
          </Switch>
        );
      }
    }
    return (
      <BrowserRouter>
        <Navbar />
        {pom}
      </BrowserRouter>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userID: state.userID,
    token: state.token,
    role: state.role,
  };
};

export default connect(mapStateToProps)(App);
