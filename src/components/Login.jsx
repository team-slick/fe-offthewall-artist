import React, { Component } from "react";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import "../App.css";
import "../styles/Login.css"

class Login extends Component {
  state = {};
  render() {
    return (
      <Grid container component="main" className="root">
        <Grid item xs={false} sm={4} md={7} className="image" />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className="paper">
            <form className="form" noValidate>
              <div className='group'>
                <input type="text" />
                <label>Username</label>
                <span className="highlight" />
                <span className="bar" />
              </div>

              <div className='group'>
                <input type="password" />
                <label>Password</label>
                <span className="highlight" />
                <span className="bar" />
              </div>

              <button type="submit" className="submit">
                SIGN IN
                <div className="ripples">
                  <span className="circle"></span>
                </div>
              </button>
              <div className="links">
                <Link to="#">Forgot password?</Link>
                <Link to="#">Don't have an account? Sign Up</Link>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default Login;
