import React, { Component } from 'react';
import { Router } from '@reach/router';
// import Header from './components/Header';
import Login from './components/Login';
import RegForm from './components/RegForm';
import Upload from './components/Upload';
import './App.css';
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';
import { useQuery, useMutation } from "@apollo/react-hooks"

const LOG_IN = gql`
  mutation Login($artist_username: String!, $artist_password: String!) {
    login(artist_username: $artist_username               artist_password: $artist_password) {
      token
      user {
        artist_id
      }
    }
  }
`

function UserLogin() {
  let input;
  const [login, { data }] = useMutation(LOG_IN);
  console.log(data)
  return (
    <div>

    </div>
  )
}


const client = new ApolloClient({
  uri: 'https://offthewall-teamslick.herokuapp.com'
})

function FetchAllWalls() {
  const { loading, error, data } = useQuery(gql`
  {
    fetchAllWalls{
      wall_id
      street_address
    }
  }
  `)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  console.log(data.fetchAllWalls[0])
  return data.fetchAllWalls[0].wall_id;
}


class App extends Component {
  state = {}
  render() {
    return (
      <div className="App" >
        {/* <Header /> */}
        <ApolloProvider client={client} >
          <div>
            <FetchAllWalls />
          </div>
          <Router>
            <Login path='/login' />
            <RegForm path='/register' />
            <Upload path='/upload' />
          </Router>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
