import React from 'react';
import { Router } from '@reach/router';
// import Header from './components/Header';
import Login from './components/Login';
import RegForm from './components/RegForm';
import Upload from './components/Upload';
import './App.css';

function App() {

  return (
    <div className="App" >
      {/* <Header /> */}
      <Router>
        <Login path='/login' />
        <RegForm path='/register' />
        <Upload path='/upload' />
      </Router>
    </div>
  );
}

export default App;
