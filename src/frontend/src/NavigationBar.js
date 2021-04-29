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
import UserPage from "./UserPage";
import GoogleLogin from "./login/GoogleLoginButton"
import {AppBar,Tabs,Tab,Typography,withStyles,Button} from '@material-ui/core'
import {useSelector,useDispatch} from "react-redux";

// import {getClients} from "./API"


function NavigationBar(props){
    const loggedIn = useSelector(state=> state.user.loggedIn)
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
                    
                    <Link to={'/login'}>
                        <Button
                        color="secondary"
                        variant="contained"
                        >
                            {loggedIn? "Logout":"Login"}
                        </Button>
                    </Link>
                    
                </div>
            </div>
            </AppBar>
            <div id="content">
            
            <div id="page">
                {props.children}
            </div>
            
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
                to = {'/user'}
                className="navigation"
                id = "user"
                >
                   {loggedIn && <Tab label="User" />}
                </Link>  
            </Tabs>
            
                
            </div>
        </Router>
    )

};

export {NavigationBar};