import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';

import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER, UPDATE_USER_RECIPE } from '../../queries/index';
import Spinner from '../Spinner';

class UserRecipes extends Component {

  state = {
    _id: '',
    name: '',
    imageUrl: '',
    category: '',
    description: '',
    modal: false
  }

  inputChangedHandler = e => this.setState({ [e.target.name]: e.target.value });

  closeModal = () => this.setState({ modal: false })

  deleteHandler = deleteUserRecipe => {
    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
    if (confirmDelete) {
      deleteUserRecipe()
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => console.log(err));
    }
  }

  loadRecipe = recipe => {
    console.log(recipe);
    this.setState({ ...recipe, modal: true })
  }

  handleSubmit = (e, updateUserRecipe) => {
    e.preventDefault();
    updateUserRecipe()
      .then(({ data }) => {
        console.log(data);
        this.closeModal();
      });
  }


  render() {
    const { modal } = this.state;
    const { username } = this.props;

    return (
      <Query query={GET_USER_RECIPES} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />
          if (error) return <div>Error</div>

          return (
            <ul>
              {modal &&
                <EditRecipeModal
                  closeModal={this.closeModal}
                  handleSubmit={this.handleSubmit}
                  recipe={this.state}
                  inputChangedHandler={this.inputChangedHandler} />}
              <h3>Your Recipes</h3>
              {!data.getUserRecipes.length && <p><strong>You haven't added any recipes yet!</strong></p>}
              {data.getUserRecipes.map(recipe => (
                <li key={recipe._id}>
                  <Link to={`/recipes/${recipe._id}`}><p>{recipe.name}</p></Link>
                  <p style={{ marginBottom: '0' }}>Likes: {recipe.likes}</p>
                  <Mutation
                    mutation={DELETE_USER_RECIPE}
                    variables={{ _id: recipe._id }}
                    refetchQueries={() => [
                      { query: GET_ALL_RECIPES },
                      { query: GET_CURRENT_USER }
                    ]}
                    update={(cache, { data: { deleteUserRecipe } }) => {
                      const { getUserRecipes } = cache.readQuery({
                        query: GET_USER_RECIPES,
                        variables: { username }
                      });

                      cache.writeQuery({
                        query: GET_USER_RECIPES,
                        variables: { username },
                        data: { // jak chcemy żeby dane wygladaly po zmianie?
                          getUserRecipes: getUserRecipes.filter(recipe => recipe._id !== deleteUserRecipe._id)
                        }
                      });
                    }} >
                    {(deleteUserRecipe, attrs = {}) => { // attrs daje nam dostep np. do tego, czy mutacja jeszcze sie wykonuje
                      return (
                        <>
                          <button
                            className="button-primary"
                            onClick={() => this.loadRecipe(recipe)}>Update</button>
                          <p
                            onClick={() => this.deleteHandler(deleteUserRecipe)}
                            className="delete-button">
                            {attrs.loading ? 'deleting...' : "X"}
                          </p>
                        </>
                      );
                    }}
                  </Mutation>
                </li>
              ))}
            </ul>
          );
        }}
      </Query>
    )
  }
}

const EditRecipeModal = ({ handleSubmit, recipe, inputChangedHandler, closeModal }) => (
  <Mutation
    mutation={UPDATE_USER_RECIPE}
    variables={{
      _id: recipe._id,
      name: recipe.name,
      imageUrl: recipe.imageUrl,
      category: recipe.category,
      description: recipe.description
    }} >
    {(updateUserRecipe) => {

      return (
        <div className="modal modal-open">
          <div className="modal-inner">
            <div className="modal-content">
              <form onSubmit={(e) => handleSubmit(e, updateUserRecipe)} className="modal-content-inner">
                <h4>Edit Recipe</h4>
                <label htmlFor="name">Recipe Name</label>
                <input type="text" name="name" onChange={inputChangedHandler} value={recipe.name} />
                <label htmlFor="imageUrl">Recipe Image</label>
                <input type="text" name="imageUrl" onChange={inputChangedHandler} value={recipe.imageUrl} />
                <select name="category" onChange={inputChangedHandler} value={recipe.category} >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <label htmlFor="description">Recipe Description</label>
                <input type="text" name="description" onChange={inputChangedHandler} value={recipe.description} />
                <hr />
                <div className="modal-buttons">
                  <button className="button-primary" type="submit">Update</button>
                  <button onClick={closeModal} >Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }}
  </Mutation>
);

export default UserRecipes;
