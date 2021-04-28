import logo from './logo.svg';
import React, {useState} from "react";
import './App.css';
import UserPage from './UserPage'
import LoginPage from './login/LoginPage'
import Estimate from './Estimate'
import Home from './Home'
import {NavigationBar as Nav} from './NavigationBar'
import {BrowserRouter as Router,Redirect,Route,Switch} from "react-router-dom";
import { useSelector } from 'react-redux'

const App = () => {
  const loggedIn = useSelector(state=> state.user.loggedIn)
  return (
    <Router>
      <Nav> 
        <Switch>
          <Route path="/user">
            { loggedIn ? <UserPage />: <Redirect to="/login"/>}
          </Route>
          <Route path="/estimate">
            <Estimate/>
          </Route>
          <Route path="/login">
            {loggedIn? <Redirect to="/"/>:<LoginPage/>}
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Nav>
    </Router>
  );
}

export default App;
