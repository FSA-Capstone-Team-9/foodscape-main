const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const path = require("path")
// Construct a schema, using GraphQL schema language
// Provide type definitions and resolver functions for your schema fields
const resolvers = require("./resolvers")
const typeDefs = require("./typeDefs")

// initiate server
const server = new ApolloServer({ typeDefs, resolvers })
const app = express()

// For Heroku - Only require dotenv when NODE_ENV is set to development
if (process.env.NODE_ENV == 'development')
require('dotenv').config({ silent: true });

//utilize express as middleware for the server
server.applyMiddleware({ app })

app.use(express.static(path.join(__dirname, "..", "public")))
app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "..", "public/index.html"))
)

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
