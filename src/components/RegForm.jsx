import React, { Component } from 'react';
import '../App.css';

class RegForm extends Component {
  state = {}
  render() {
    return (
      <div>
        <p>This part of the site currently needs a little love.</p>
        <p>If you'd like to register an account or reset a password, please send us an email!</p>
        <a href="mailto:hi.artleeds@gmail.com">hi.artleeds@gmail.com</a>

      </div>
    )
  }
}

export default RegForm;