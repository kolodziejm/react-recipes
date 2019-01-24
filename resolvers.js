exports.resolvers = {
  Query: {
    getAllRecipes: async (parent, args, ctx) => {
      const { Recipe } = ctx;
      const allRecipes = await Recipe.find();
      return allRecipes;
    }
  },
  Mutation: {
    addRecipe: async (parent, args, ctx) => {
      const { name, description, category, instructions, username } = args;
      const { Recipe } = ctx;
      const newRecipe = await new Recipe({
        name,
        description,
        category,
        instructions,
        username
      }).save();
      return newRecipe;
    }
  }
};