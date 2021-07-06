const express = require("express")
const { ApolloServer } = require("apollo-server-express")

// Construct a schema, using GraphQL schema language
// Provide type definitions and resolver functions for your schema fields
const resolvers = require("./resolvers")
const typeDefs = require("./typeDefs")

// initiate server
const server = new ApolloServer({ typeDefs, resolvers })
const app = express()

//utilize express as middleware for the server
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
