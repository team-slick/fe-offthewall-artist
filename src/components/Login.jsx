import React, { Component } from "react";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import "../App.css";
import "../styles/Login.css";
import { gql } from "apollo-boost";
import { Mutation } from "@apollo/react-components";
import { navigate } from "@reach/router";

const LOGIN = gql`
  mutation Login($artist_username: String!, $artist_password: String!) {
    login(
      artist_username: $artist_username
      artist_password: $artist_password
    ) {
      token
      user {
        artist_id
        artist_username
      }
    }
  }
`;

class Login extends Component {
  state = {
    artist_username: "",
    artist_password: ""
  };

  render() {
    const { artist_username, artist_password } = this.state;
    return (
      <Grid container component="main" className="root">
        <Grid item xs={false} sm={4} md={7} className="image" />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className="paper">
            <Mutation
              mutation={LOGIN}
              onCompleted={({ login }) => {
                this.saveUserData(login.user.artist_id, login.user.artist_username, login.token);
              }}
            >
              {(login, { loading, error, data }) => {
                // if (loading) return <p>Loading...</p>;
                // if (error) return <p>Error.</p>;
                // if (data) console.log("data");

                return (
                  <form
                    className="form"
                    onSubmit={event => {
                      event.preventDefault();
                      login({
                        variables: { artist_username, artist_password }
                      })
                        .then(res => res)
                        .catch(err => err);
                    }}
                  >
                    <div className="group">
                      <input
                        className={this.state.artist_username === '' ? 'username' : 'used'}
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.username}
                      />
                      <label>Username</label>
                      <span className="highlight" />
                      <span className="bar" />
                    </div>
                    <div className="group">
                      <input
                        className={this.state.artist_password === '' ? 'password' : 'used'}
                        type="password"
                        onChange={this.handleChange}
                        value={this.state.password}
                      />
                      <label>Password</label>
                      <span className="highlight" />
                      <span className="bar" />
                    </div>
                    <button type="submit" className="submit">
                      SIGN IN
                      <div className="ripples">
                        <span className="circle" />
                      </div>
                    </button>
                    <div className="links">
                      <Link to="#">Forgot password?</Link>
                      <Link to="#">Don't have an account? Sign up.</Link>
                    </div>
                  </form>
                );
              }}
            </Mutation>
          </div>
        </Grid>
      </Grid>
    );
  }

  saveUserData = (artist_id, artist_username, token) => {
    localStorage.setItem("ARTIST_ID", artist_id);
    localStorage.setItem("AUTH_TOKEN", token);
    localStorage.setItem("USERNAME", artist_username)
    navigate("/upload");
  };

  handleChange = event => {
    const { value } = event.target;
    if (event.target.type === "text") {
      this.setState({ artist_username: value });
    } else {
      this.setState({ artist_password: value });
    }
  };
}

export default Login;
