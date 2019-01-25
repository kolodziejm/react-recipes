const jwt = require('jsonwebtoken');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllRecipes: async (parent, args, ctx) => {
      const { Recipe } = ctx; // model
      const allRecipes = await Recipe.find();
      return allRecipes;
    }
  },
  Mutation: {
    addRecipe: async (parent, args, ctx) => {
      const { name, description, category, instructions, username } = args;
      const { Recipe } = ctx; // model którego potrzebujemy
      const newRecipe = await new Recipe({
        name,
        description,
        category,
        instructions,
        username
      });
      newRecipe.save()
      return newRecipe;
    },

    signupUser: async (parent, args, ctx) => {
      const { username, email, password } = args;
      const { User } = ctx; // model którego potrzebujemy
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User already exists')
      }
      const newUser = await new User({
        username,
        email,
        password
      });
      newUser.save();
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    }
  }
};