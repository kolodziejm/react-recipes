import React, { Component } from 'react'

import withSession from '../withSession';
import { Mutation } from 'react-apollo';

import { LIKE_RECIPE } from '../../queries/index';

class LikeRecipe extends Component {

  state = {
    username: ''
  }

  componentDidMount() {
    if (this.props.session.getCurrentUser) { // if user is logged in
      const { username } = this.props.session.getCurrentUser;
      this.setState({ username });
    }
  }

  likeHandler = likeRecipe => {
    likeRecipe()
      .then(({ data }) => {
        console.log(data);
      });
  };

  render() {
    const { username } = this.state;
    const { _id } = this.props;

    return (
      <Mutation
        mutation={LIKE_RECIPE}
        variables={{ _id, username }} >
        {(likeRecipe) => {

          return username && <button onClick={() => this.likeHandler(likeRecipe)}>Like</button>
        }}
      </Mutation>
    );
  }
}

export default withSession(LikeRecipe);
