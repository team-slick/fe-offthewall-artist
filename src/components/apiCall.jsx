import React from 'react';
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { gql } from "apollo-boost";


const client = new ApolloClient({
  link: createHttpLink({
    uri: 'postgres://ntpalrxsbmuelo:3c7bee604f60b2550a20d1111dfe6728d3e6d8e08a830cc6e4c25c3ef4b4b65d@ec2-54-221-244-70.compute-1.amazonaws.com:5432/d19qvt0012u6gc'
  }),
  cache: new InMemoryCache()
})


client.query({
  query: gql`
  {
    fetchAllWalls{
      wall_id
      street_address
    }
  }`
}).then(result => console.log(result));


export default client;