import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { SIGNIN_USER } from '../../queries/index';
import Error from '../Error';

const initialState = {
  username: '',
  password: '',
};

class Signin extends Component {

  state = {
    ...initialState
  };

  clearState = () => {
    this.setState({ ...initialState });
  }

  inputChangedHandler = e => this.setState({ [e.target.name]: e.target.value });

  submitHandler = (e, signinUser) => {
    e.preventDefault();
    signinUser()
      .then(async ({ data }) => {
        localStorage.setItem('token', data.signinUser.token);
        await this.props.refetch(); // wykona query jeszcze raz
        this.clearState();
        this.props.history.push('/');
      })
      .catch(err => console.log(err));
  };

  validateForm = () => {
    const { username, password } = this.state;
    const isInvalid = !username || !password;
    return isInvalid;
  }

  render() {
    const { username, password } = this.state;

    return (
      <div className="App">
        <h2 className="App">Signin</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {(signinUser, { data, loading, error }) => { // W MUTATION COMPONENT MAMY DOSTEP DO TEJ MUTACJI KTÓRĄ WYKONUJEMY
            return (
              <form className="form" onSubmit={e => this.submitHandler(e, signinUser)}>
                <input type="text" name="username" placeholder="Username" onChange={this.inputChangedHandler} value={username} />
                <input type="password" name="password" placeholder="Password" onChange={this.inputChangedHandler} value={password} />
                <button type="submit" className="button-primary" disabled={loading || this.validateForm()}>Submit</button>
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signin);
