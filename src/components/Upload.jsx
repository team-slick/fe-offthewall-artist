import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { storage } from "../firebase";
import "../styles/Upload.css";
import { Query } from '@apollo/react-components';
import { gql } from 'apollo-boost';

class Upload extends Component {
  state = {
    image: null,
    urlString: "",
    wall_id: null,
    wall_address: '',
    isConfirmed: false
  };

  render() {
    const { ARTIST_ID, USERNAME } = localStorage
    return (
      <Grid container component="main" className="root">
        <Grid item xs={false} sm={4} md={7} className="image" />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className="paper">
            <p>
              Welcome <b>{USERNAME}</b>, simply choose a wall from the list
              below and upload you art.
            </p>
            <form className="form">
            <p className='select-label'>Choose a wall:</p>
              <select className='drop-down' onChange={this.handleSelectChange}>
                <Query query={gql`
                {
                  fetchAllWalls {
                    wall_id
                    street_address
                    canvas_width
                    canvas_height
                  }
                }`}>
                {({loading, error, data }) => {
                  if (loading) return <option>Loading...</option>
                  if (error) return <option>Error :(</option>
                  return data.fetchAllWalls.map(wall => (
                    <option value={wall.wall_id} key={wall.wall_id}>Address: {wall.street_address}  Dimensions: {wall.canvas_width} x {wall.canvas_height}</option>
                  ))
                }}
                </Query>
              </select>
              <p className='upload-label'>Upload your artwork:</p>
              <input type="file" onChange={this.handleChange} className='upload'/>
              <button
                className="submit"
                onClick={this.handleUpload}
              >
                SUBMIT
                <div className="ripples">
                  <span className="circle" />
                </div>
              </button>
            </form>
              {this.state.isConfirmed && <p>Thank you. <br/>Your ARt has been uploaded the wall!</p>}
          </div>
        </Grid>
      </Grid>
    );
  }

  handleChange = event => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      this.setState(() => ({ image }));
    }
  };

  handleSelectChange = event => {
    const { value } = event.target
    this.setState({wall_id: value})
  }

  handleUpload = (event) => {
    event.preventDefault()
    const { image } = this.state;
    const uploadTask = storage.ref(`${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        // progress function
      },
      error => {
        // error function
        console.log(error);
      },
      () => {
        // complete function
        storage
          .ref()
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            this.setState({urlString: url, isConfirmed: true})
          })
      }
    );
  };
}

export default Upload;
