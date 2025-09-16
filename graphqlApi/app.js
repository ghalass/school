const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const prisma = require("./prismaClient");

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.json());

app.use(isAuth)

app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    }));

// PRISMA & RUN SERVER
prisma
    .$connect()
    .then(() => {
        // listen for requests
        app.listen(PORT, () => {
            console.log(`Connected to DB & GraphQL server running on http://localhost:${PORT}/graphql `);
        })
    })
    .catch((error) => {
        console.log(error);
    });