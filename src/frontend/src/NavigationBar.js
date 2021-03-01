import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";
import AdminPage from "./AdminPage";
// import {getClients} from "./API"


function NavigationBar(){
    const [error, setError] = useState(null);
    
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link
                        to={'/estimate'}
                        id="estimate"
                        >
                            Estimate
                        </Link>
                    </li>
                    <li>
                        <Link 
                        to = {'/admin'}
                        id = "admin"
                        >
                            Admin
                        </Link>
                    </li>
                </ul>   
            </nav>

            <Switch>
                <Route path="/admin">
                    <AdminPage />
                </Route>
            </Switch>

        </Router>
        
    )

};

export {NavigationBar};