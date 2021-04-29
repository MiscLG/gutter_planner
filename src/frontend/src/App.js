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

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {Paper, CssBaseline} from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type:"dark",
    primary: {
      main: "#45ad7e",
    },
    secondary: {
      main: '#17242d',
    },
    background: {
      default: '#17242d',
    }
  },
});

const App = () => {
  const loggedIn = useSelector(state=> state.user.loggedIn)
  return (
    <Router>
      <MuiThemeProvider theme={theme}>
      <CssBaseline />
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
      </MuiThemeProvider>
    </Router>
  );
}

export default App;
