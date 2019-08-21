import React, { Component } from 'react';
import { Router } from '@reach/router';
import Login from './components/Login';
import RegForm from './components/RegForm';
import Upload from './components/Upload';
import './App.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';
import { navigate } from '@reach/router/lib/history';



const client = new ApolloClient({
  uri: 'https://offthewall-teamslick.herokuapp.com'
})


class App extends Component {
  state = {}
  render() {
    return (
      <div className="App" >
        <ApolloProvider client={client} >
          <Router>
            <Login path='/login' />
            <Login path='/' />
            <RegForm path='/register' />
            <Upload path='/upload' />
          </Router>
        </ApolloProvider>
      </div>
    );
  }
  // componentDidMount = () => {
  //   navigate("./")
  // }
  //! on refresh navigates all pages to login.
}

export default App;
