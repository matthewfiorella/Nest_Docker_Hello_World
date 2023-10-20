import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Calc from './components/sqrt/Calc';
import Postal from './components/postal-care/Postal'
import './App.css';

function App(): JSX.Element {
  return (
    <div className="App">
        <div className={'container'}>
        <BrowserRouter>
          <Switch>
            <Route path={"/sqrt"} component={Calc} />
            <Route path={"/postal"} component={Postal} />
          </Switch>
        </BrowserRouter>
        </div>
    </div>
  );
}

export default App;
