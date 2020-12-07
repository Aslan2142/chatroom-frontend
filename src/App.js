import React from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';

import Page404 from './components/Page404';
import Home from './components/Home';

import { RootPath } from './AppSettings';

import './App.scss'

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path={RootPath + '/'} exact component={Home} />
            <Route component={() => <Page404 path={useLocation().pathname}/>} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }

}

export default App;