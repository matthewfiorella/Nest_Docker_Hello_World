import React, { useState } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Calc from './components/sqrt/Calc';
import Postal from './components/postal-care/Postal'
import Root from './components/root/Root';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navigation/Navbar.js";
import NotFound from "./components/not-found/NotFound";
import Support from "./components/support/Support";
import Login from "./components/login/Login";
import useToken from './customHooks/useToken';
import Register from './components/register/Register';
import Verify from './components/verify/Verify';

function App(): JSX.Element {
  
  const { token, setToken } = useToken();

  return (
    <div className="App">
        <div className={'container'}>
        <BrowserRouter>
          <Navbar/>
          <Switch>
            <Route exact path={"/sqrt"} component={Calc} />
            <Route exact path={"/postal"} component={Postal} />
            <Route exact path={"/"} component={Root} />
            <Route exact path={"/support"} component={Support} />
            <Route exact path={"/login"} component={() => <Login setToken={setToken} />} />
            <Route exact path={"/register"} component={Register} />
            <Route exact path={"/verify"} component={Verify} />
            <Route path={"*"} component={NotFound} />
          </Switch>
        </BrowserRouter>
        </div>
    </div>
  );
}

export default App;
