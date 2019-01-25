import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import './index.css';
import * as serviceWorker from './serviceWorker';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import App from './components/App';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';

const client = new ApolloClient({
  uri: 'http://localhost:4444/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token
      }
    })
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.log('Network Error', networkError);
    }
  }
})

const app = (
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        <Redirect to="/" />
      </Switch>
    </Router>
  </ApolloProvider>
)

ReactDOM.render(app, document.getElementById('root'));
