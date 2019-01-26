import { gql } from 'apollo-boost';


/* RECIPES QUERIES */

export const GET_ALL_RECIPES = gql`
  query {
    getAllRecipes {
      _id
      name
      category
    }
  }
`;

export const GET_RECIPE = gql`
  query($_id: ID!) {
    getRecipe(_id: $_id) {
      _id
      name
      category
      description
      instructions
      createdDate
      likes
    }
  }
`;

/* RECIPES MUTATIONS */


/* USER QUERIES */

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      username
      joinDate
      email
    }
  }
`;


/* USER MUTATIONS */

export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
  signinUser(username: $username, password: $password) {
    token
  }
}
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }

`;