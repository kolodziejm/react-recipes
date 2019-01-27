const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllRecipes: async (parent, args, ctx) => {
      const { Recipe } = ctx; // model

      const allRecipes = await Recipe.find().sort({ createdDate: "desc" });
      return allRecipes;
    },

    getRecipe: async (parent, args, ctx) => {
      const { _id } = args;
      const { Recipe } = ctx;

      const recipe = await Recipe.findOne({ _id });
      return recipe;
    },

    searchRecipes: async (parent, args, ctx) => {
      const { searchTerm } = args;
      const { Recipe } = ctx;

      if (searchTerm) {
        const searchResults = await Recipe.find({ $text: { $search: searchTerm } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
        return searchResults;
      } else {
        const recipes = await Recipe.find().sort({ likes: 'desc', createdDate: 'desc' });
        return recipes;
      }
    },

    getUserRecipes: async (parent, args, ctx) => {
      const { username } = args;
      const { Recipe } = ctx;

      const userRecipes = await Recipe.find({ username }).sort({ createdDate: "desc" });
      return userRecipes;
    },

    getCurrentUser: async (parent, args, ctx) => {
      const { User, currentUser } = ctx; // rzeczy ktore sa ustawione w context w server.js

      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({ username: currentUser.username })
        .populate({
          path: 'favorites',
          model: 'Recipe'
        });
      return user;
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

    deleteUserRecipe: async (parent, args, ctx) => {
      const { _id } = args;
      const { Recipe } = ctx;

      const recipe = await Recipe.findOneAndRemove({ _id });
      return recipe;
    },

    // LOGOWANIE
    signinUser: async (parent, args, ctx) => {
      const { username, password } = args;
      const { User } = ctx; // model który potrzebujemy

      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password')
      }

      return { token: createToken(user, process.env.SECRET, "1hr") };
    },
    // REJESTRACJA
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