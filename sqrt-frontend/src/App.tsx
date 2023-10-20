import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Calc from './components/sqrt/Calc';
import './App.css';

function App(): JSX.Element {
  return (
    <div className="App">
        <div className={'container'}>
          <Switch>
            <Route path={"/"} exact={true} component={Calc} />
          </Switch>
        </div>
    </div>
  );
}

export default App;
