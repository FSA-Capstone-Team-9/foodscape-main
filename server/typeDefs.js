const { gql } = require("apollo-server")

//define the datatypes for types, queries, and mutations
module.exports = gql`
    type Query {
        hello: String
    }
`
