import React from "react"
import ReactDOM from "react-dom"
// import { Provider } from "react-redux"
import { Router } from "react-router-dom"
import history from "./history"
import { ApolloProvider } from "@apollo/client"
// import store from './store'
import App from "./App"
//TODO figure out how to replace store with react hooks

export const client = new ApolloClient({
    // options go here
    // client uri
    uri: "http://localhost:4000",
    cache: new InMemoryCache(),
})

ReactDOM.render(
    // <Provider store={store}>
    // <div>Hello</div>,
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById("app")
)
