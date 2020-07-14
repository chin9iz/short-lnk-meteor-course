
import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from 'history';
import {Router, Switch, Route, Redirect} from 'react-router-dom';
import {Tracker} from 'meteor/tracker';

import Login from './../ui/Login';
import Signup from './../ui/Signup';
import Links from './../ui/Link';
import NotFound from './../ui/NotFound';

export const history = createBrowserHistory();

const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/links'];
const PublicRoute = ({component: Component, ...rest}) => {
  return (
      <Route {...rest} render={props => (
          Meteor.userId()?
              <Redirect to="/links" />
          : <Component {...props} />
      )} />
  );
};
const PrivateRoute = ({component: Component, ...rest}) => {
  return (
      <Route {...rest} render={props => (
          !Meteor.userId()?
              <Redirect to="/" />
          : <Component {...props} />
      )} />
  );
};

export const onAuthChange = (isAuthenticated) => {
  const pathname = history.location.pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);
  
  if (isUnauthenticatedPage && isAuthenticated) {
    history.push('/links')
  } else if (isAuthenticatedPage && !isAuthenticated) {
    history.push('/')
  }
};

export const routes = (
  <Router history={history}>
    <Switch>
      <PublicRoute exact path='/' component={Login}/>
      <PublicRoute path='/signup' component={Signup}/>
      <PrivateRoute path='/links' component={Links}/>
      <PrivateRoute path='*' component={NotFound}/>
    </Switch>
  </Router>
);

Tracker.autorun(() => {
  const isAuthenticated = !!Meteor.userId();
  const pathname = history.location.pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);
  
  if (isUnauthenticatedPage && isAuthenticated) {
    history.push('/links')
  } else if (isAuthenticatedPage && !isAuthenticated) {
    history.push('/')
  }
});

Meteor.startup(() => {
  ReactDOM.render(routes, document.getElementById('app'));
});