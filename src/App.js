import React from 'react';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from './components/Login';
import Dashboard from './components/Dashboard';

import OnePager from './layouts/OnePager';
import Page from './layouts/Page';

import PrivateRoute from './components/PrivateRoute';

import 'antd/dist/antd.css';

import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <OnePager>
            <Login onLoginRedirect="/" />
          </OnePager>
        </Route>
        <PrivateRoute path='/'>
          <Page>
            <Dashboard />
          </Page>
        </PrivateRoute>
      </Switch>
    </Router>
  );
}

export default App;
