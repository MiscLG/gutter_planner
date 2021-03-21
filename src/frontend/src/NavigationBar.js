import React, {useState,useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";
import './NavigationBar.css'
import AdminPage from "./AdminPage";
import GoogleLogin from "./GoogleLoginButton"
import {AppBar,Tabs,Tab,Typography,withStyles} from '@material-ui/core'
// import {getClients} from "./API"


function NavigationBar(props){
    const [error, setError] = useState(null);
    useEffect(()=>{
        // Drawer.toggleDrawer("top",true);
    },[]);
    return (
        <Router>
            <AppBar
            position="responsive"
            > 
            <div>
                <Link
                to={'/'}
                className="navigation"
                id="home">
                    <Typography
                    align='left'
                    variant='h4'>
                        Leo's Quality Gutters
                    </Typography>   
                </Link>
                <div id="logins">
                    <GoogleLogin /> 
                    <Link to={'/login'}>Login</Link>
                </div>
            </div>
            </AppBar>
            <div id="content">
            <Switch>
            <div id="page">
                {props.children}
            </div>
            </Switch>
            
            <Tabs
            orientation="vertical"
            > 
                <Link
                to={'/estimate'}
                className="navigation"
                id="estimate"
                >
                    <Tab label="Estimate"/>
                </Link>
                <Link 
                to = {'/admin'}
                className="navigation"
                id = "admin"
                >
                    <Tab label="Admin" />
                </Link>  
            </Tabs>
            
                
            </div>
        </Router>
    )

};

export {NavigationBar};