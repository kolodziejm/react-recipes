import React, { Component } from 'react'
import { Mutation } from 'react-apollo';

import { SIGNUP_USER } from '../../queries/index';
import Error from '../Error';

const initialState = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: ''
};

class Signup extends Component {

  state = {
    ...initialState
  };

  clearState = () => {
    this.setState({ ...initialState });
  }

  inputChangedHandler = e => this.setState({ [e.target.name]: e.target.value });

  submitHandler = (e, signupUser) => {
    e.preventDefault();
    signupUser()
      .then(({ data }) => {
        console.log(data);
        localStorage.setItem('token', data.signupUser.token);
        this.clearState();
      })
      .catch(err => console.log(err));
  };

  validateForm = () => {
    const { username, email, password, passwordConfirmation } = this.state;
    const isInvalid = !username || !email || !password || password !== passwordConfirmation;
    return isInvalid;
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state;

    return (
      <div className="App">
        <h2 className="App">Signup</h2>
        <Mutation mutation={SIGNUP_USER} variables={{ username, email, password }}>
          {(signupUser, { data, loading, error }) => { // W MUTATION COMPONENT MAMY DOSTEP DO TEJ MUTACJI KTÓRĄ WYKONUJEMY

            return (
              <form className="form" onSubmit={e => this.submitHandler(e, signupUser)}>
                <input type="text" name="username" placeholder="Username" onChange={this.inputChangedHandler} value={username} />
                <input type="email" name="email" placeholder="Email address" onChange={this.inputChangedHandler} value={email} />
                <input type="password" name="password" placeholder="Password" onChange={this.inputChangedHandler} value={password} />
                <input type="password" name="passwordConfirmation" placeholder="Confirm Password" onChange={this.inputChangedHandler} value={passwordConfirmation} />
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

export default Signup;
