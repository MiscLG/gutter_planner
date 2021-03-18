import logo from './logo.svg';
import React, {useState} from "react";
import './App.css';
import AdminPage from './AdminPage'
import LoginPage from './LoginPage'
import Estimate from './Estimate'
import Home from './Home'
import {NavigationBar as Nav} from './NavigationBar'
import {BrowserRouter as Router,Redirect,Route} from "react-router-dom";

const App = () => {
  const [loggedIn, setLoginStatus] = useState(true)
  const [user,setUser] = useState({})
  return (
    <Router>
      <Nav> 
        <Route path="/">
          <Home />
        </Route>
        <Route path="/admin">
          { loggedIn ? <AdminPage />: <Redirect to="/login"/>}
        </Route>
        <Route path="/estimate">
          {loggedIn? <Estimate/>: <Redirect to="/login"/>}
        </Route>
        <Route path="/login">
         {loggedIn? <Redirect to="/"/>:<LoginPage/>}
        </Route>
      </Nav>
    </Router>
  );
}

export default App;
