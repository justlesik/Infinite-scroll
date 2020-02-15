import React from 'react';
import { Provider } from 'react-redux';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import List from '../List';
import NotFound from '../NotFound';

import store from '../../store';
import history from '../../history';

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/list" exact component={List} />
        {/* <Route path="/list/:id" component={} */}
        <Redirect from="/" to="/list" exact />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </Provider>
);

export default App;
