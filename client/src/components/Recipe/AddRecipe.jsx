import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries';
import Error from '../Error';

import withAuth from '../withAuth';

const initialState = {
  name: '',
  category: 'Breakfast',
  description: '',
  instructions: '',
  username: ''
};

class AddRecipe extends Component {

  state = {
    ...initialState
  };

  clearState = () => {
    this.setState({ ...initialState });
  }

  inputChangedHandler = e => this.setState({ [e.target.name]: e.target.value });

  componentDidMount() {
    this.setState({ username: this.props.session.getCurrentUser.username })
  }

  validateForm = () => {
    const { name, category, description, instructions } = this.state;
    const isInvalid = !name || !category || !description || !instructions;
    return isInvalid;
  }

  submitHandler = (e, addRecipe) => {
    e.preventDefault();
    addRecipe()
      .then(({ data }) => {
        console.log(data);
        this.clearState();
        this.props.history.push('/');
      })
      .catch()
  }

  updateCache = (cache, { data: { addRecipe } }) => {
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    });
  }

  render() {
    const { name, category, description, instructions, username } = this.state;

    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, category, description, instructions, username }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
        update={this.updateCache} >
        {(addRecipe, { data, loading, error }) => {

          return (
            <div className="App">
              <h2 className="App">Add Recipe</h2>
              <form className="form" onSubmit={(e) => this.submitHandler(e, addRecipe)} >
                <input type="text" name="name" placeholder="Recipe Name" onChange={this.inputChangedHandler} value={name} />
                <select name="category" onChange={this.inputChangedHandler} value={category}>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <input type="text" name="description" placeholder="Add description" onChange={this.inputChangedHandler} value={description} />
                <textarea name="instructions" onChange={this.inputChangedHandler} placeholder="Add instructions" value={instructions} ></textarea>
                <button disabled={loading || this.validateForm()} type="submit" className="button-primary">Submit</button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    )
  }
}

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddRecipe));
