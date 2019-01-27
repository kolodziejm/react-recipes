import React from 'react'
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';

import { GET_USER_RECIPES, DELETE_USER_RECIPE } from '../../queries/index';

const deleteHandler = deleteUserRecipe => {
  const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
  if (confirmDelete) {
    deleteUserRecipe()
      .then(({ data }) => {
        console.log(data);
      })
      .catch(err => console.log(err));
  }
}

const UserRecipes = ({ username }) => {
  return (
    <Query query={GET_USER_RECIPES} variables={{ username }}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>
        if (error) return <div>Error</div>

        return (
          <ul>
            <h3>Your Recipes</h3>
            {data.getUserRecipes.map(recipe => (
              <li key={recipe._id}>
                <Link to={`/recipes/${recipe._id}`}><p>{recipe.name}</p></Link>
                <p style={{ marginBottom: '0' }}>{recipe.likes}</p>
                <Mutation mutation={DELETE_USER_RECIPE} variables={{ _id: recipe._id }} >
                  {(deleteUserRecipe) => {
                    return (
                      <p
                        onClick={() => deleteHandler(deleteUserRecipe)}
                        className="delete-button">X</p>
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

export default UserRecipes;
