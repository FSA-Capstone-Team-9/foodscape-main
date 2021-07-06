import React from "react"
import { HELLO } from "./hooks/queries"
import { useQuery } from "@apollo/client"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import Map from "./components/map"

export const client = new ApolloClient({
    // options go here
    // client uri
    uri: "http://localhost:4000",
    cache: new InMemoryCache(),
})

const App = () => {
    // const world = useQuery(HELLO)
    // console.log(world)
    return (
        <ApolloProvider client={client}>
            <Map />
        </ApolloProvider>
    )
}

export default App
