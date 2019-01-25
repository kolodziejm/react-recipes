const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });
const cors = require('cors');
const jwt = require('jsonwebtoken');
// Graphql-express middleware
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const Recipe = require('./models/Recipe');
const User = require('./models/User');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

// Create schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));

// SET UP JWT AUTH MIDDLEWARE
app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  if (token !== "null") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      console.log(currentUser);
    } catch (err) {
      console.log(err)
    }
  }
  next();
});

const PORT = process.env.PORT || 4444;

app.use(express.json());

// Create GraphiQL App (podgląd)
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Connect Schemas with Graphql
app.use('/graphql', graphqlExpress({
  schema,
  context: {
    Recipe,
    User
  }
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('DB connected');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    })
  })
  .catch(err => console.log(err));
