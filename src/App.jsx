import React, { Component } from 'react';
import { Router, navigate } from '@reach/router';
import Login from './components/Login';
import RegForm from './components/RegForm';
import Upload from './components/Upload';
import './App.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';



//const client = new ApolloClient({
  //uri: 'https://offthewall-teamslick.herokuapp.com'
//})
const client = new ApolloClient({
  uri: 'https://damp-earth-59669.herokuapp.com'
})


class App extends Component {
  state = {}
  render() {
    return (
      <div className="App" >
        <ApolloProvider client={client} >
          <Router>
            <Login path='/login' />
            <RegForm path='/register' />
            <Upload path='/upload' />
          </Router>
        </ApolloProvider>
      </div>
    );
  }
  componentDidMount = () => {
    if (!localStorage.getItem("AUTH_TOKEN")) {
      navigate("/login");
    }
  }
}

export default App;
