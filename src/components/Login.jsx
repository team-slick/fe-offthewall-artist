import React, { Component } from "react";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import "../App.css";
import "../styles/Login.css";
// import { thisExpression } from "@babel/types";
import { gql } from "apollo-boost";
import { Mutation, Query } from "@apollo/react-components";

//hard-coded for now
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJib2JiaXJhZSIsImlhdCI6MTU2NTE4NTE3OCwiZXhwIjoxNTY3Nzc3MTc4fQ.4eUZhr64Om072dYartWGpcnoai9UZonskHajuH6rfzU";

// const LOGIN = gql`
//   mutation($artist_username: String!, $artist_password: String!) {
//     login(
//       artist_username: $artist_username
//       artist_password: $artist_password
//     ) {
//       token
//     }
//   }
// `;

const LOGIN = gql`
  mutation Login($artist_username: String!, $artist_password: String!) {
    login(
      artist_username: $artist_username
      artist_password: $artist_password
    ) {
      token
      user {
        artist_id
      }
    }
  }
`;

class Login extends Component {
  state = {
    artist_username: "bobbirae",
    artist_password: "password"
  };

  render() {
    const { artist_username, artist_password } = this.state;
    return (
      <Grid container component="main" className="root">
        <Grid item xs={false} sm={4} md={7} className="image" />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className="paper">
            <Mutation mutation={LOGIN} onCompleted={data => console.log(data)}>
              {(login, { loading, error, data }) => {
                // if (loading) return <p>Loading...</p>;
                // if (error) return <p>Error.</p>;
                // if (data) console.log("data");

                const tokenToRender = data;

                return (
                  <form
                    className="form"
                    onSubmit={event => {
                      event.preventDefault();
                      login({
                        variables: { artist_username, artist_password }
                      });
                    }}
                  >
                    <button type="submit">SIGN IN</button>
                  </form>
                );
              }}
            </Mutation>
          </div>
        </Grid>
      </Grid>
    );
  }

  saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  handleChange = event => {
    const { value } = event.target;
    if (event.target.type === "text") {
      this.setState({ username: value });
    } else {
      this.setState({ password: value });
    }
  };

  // handleSubmit = event => {
  //   console.log('submitting')
  //   event.preventDefault();
  //   const { username } = this.state;
  //   // api request needed here?
  //   this.setState({ username: '', password: '' })
  // }
}

export default Login;

// <Mutation
//   mutation={LOGIN}
//   variables={{ username, password }}
//   onCompleted={data => console.log(data)}
// >
//   {mutation => <div onClick={mutation}>Run mutation</div>}
// {
/* {(login, { loading, data }) => {
          if (loading) console.log("loading");
          if (data) console.log("data");
          return (
            <Grid container component="main" className="root">
              <Grid item xs={false} sm={4} md={7} className="image" />
              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
              >
                <div className="paper">
                  <form
                    className="form"
                    onSubmit={event => {
                      event.preventDefault();
                      login("bobbirae", "password")
                        .then(res => console.log(res))
                        .catch(err => console.log(err));
                    }}
                  >
                    <div className="group">
                      <input
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
                      <Link to="#">Don't have an account? Sign Up</Link>
                    </div>
                  </form>
                </div>
              </Grid>
            </Grid>
          // );
        }} */
// }
// </Mutation>
// const LOGIN = gql`
//   mutation Login($artist_username: String!, $artist_password: String!) {
//     login(
//       artist_username: $artist_username
//       artist_password: $artist_password
//     ) {
//       token
//       user {
//         artist_id
//       }
//     }
//   }
// `;
