import React from 'react'
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';

import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER } from '../../queries/index';

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
            {!data.getUserRecipes.length && <p><strong>You haven't added any recipes yet!</strong></p>}
            {data.getUserRecipes.map(recipe => (
              <li key={recipe._id}>
                <Link to={`/recipes/${recipe._id}`}><p>{recipe.name}</p></Link>
                <p style={{ marginBottom: '0' }}>{recipe.likes}</p>
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
                      <p
                        onClick={() => deleteHandler(deleteUserRecipe)}
                        className="delete-button">
                        {attrs.loading ? 'deleting...' : "X"}
                      </p>
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
