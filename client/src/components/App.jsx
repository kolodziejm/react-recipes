import React, { Component } from 'react';
import { Query } from 'react-apollo';
import posed from 'react-pose';

import { GET_ALL_RECIPES } from '../queries/index';

import RecipeItem from './Recipe/RecipeItem';
import './App.css';

const RecipeList = posed.ul({
  shown: {
    x: '0%',
    staggerChildren: 100
  },
  hidden: {
    x: '-100%'
  }
});

class App extends Component {

  state = {
    on: false
  };

  componentDidMount() {
    setTimeout(this.slideIn, 200);
  }

  slideIn = () => {
    this.setState({ on: !this.state.on });
  }

  render() {

    return (
      <div className="App">
        <h1 className="main-title">Find Recipes You <strong>love</strong></h1>
        <Query query={GET_ALL_RECIPES}>
          {({ data, loading, error }) => {
            if (loading) return <div>Loading...</div>
            if (error) return <div>Error occured</div>
            const { on } = this.state;
            return (
              <RecipeList
                pose={on ? 'shown' : 'hidden'}
                className="cards"
              >{data.getAllRecipes.map(recipe =>
                <RecipeItem key={recipe._id} {...recipe} />)}
              </RecipeList>
            );
          }}
        </Query>
      </div>
    );
  }
};

export default App;
