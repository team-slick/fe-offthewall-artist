import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import './index.css';
import App from './App';

const client = new ApolloClient({
  uri: 'https://offthewall-teamslick.herokuapp.com'
})


client.query({
  mutation: gql`
  {
    login(artist_username:"bobbirae",artist_password:"password"){
      token
      user {
        artist_id
      }
    }
  }`
}).then(result => console.log(result));

ReactDOM.render(<App />, document.getElementById('root'));



