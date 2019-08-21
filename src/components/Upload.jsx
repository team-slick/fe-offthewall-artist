import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { storage } from "../firebase";
import "../styles/Upload.css";
import { Mutation, Query } from "@apollo/react-components";
import { gql } from "apollo-boost";
import logo from "../images/artlogo.png";

const ADD_IMAGE = gql`
  mutation AddImage($image_url: String!, $blurb: String, $wall_id: Int!) {
    addImage(image_url: $image_url, blurb: $blurb, wall_id: $wall_id) {
      image_id
    }
  }
`;

class Upload extends Component {
  state = {
    image: null,
    urlString: "",
    wall_id: null,
    wall_address: "",
    isConfirmed: false,
    canvas_url: "",
    uploading: false,
    error: null
  };

  render() {
    const {
      image,
      urlString,
      wall_id,
      canvas_url,
      wall_address,
      uploading
    } = this.state;
    const { ARTIST_ID, USERNAME } = localStorage;
    return (
      <Grid container component="main" className="root">
        <Grid item xs={false} sm={4} md={7} className="image">
          <div className="image-container">
            <img
              src={wall_id ? canvas_url : logo}
              alt={wall_id ? wall_address : "ARt:Leeds logo"}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className="paper">
            <Mutation mutation={ADD_IMAGE}>
              {(addImage, { loading, error, data }) => {
                return (
                  <div>
                    <p>
                      Welcome <b>{USERNAME}</b>, simply choose a wall from the
                      list below and upload your art.
                    </p>
                    <form
                      className="form"
                      onSubmit={event => {
                        event.preventDefault();
                        const uploadTask = storage
                          .ref(`${image.name}`)
                          .put(image);
                        uploadTask.on(
                          "state_changed",
                          snapshot => {
                            // progress function
                            this.setState({ uploading: true });
                          },
                          error => {
                            // error function
                            if (error.code_ === "storage/unauthorized") {
                              this.setState({
                                uploading: false,
                                error:
                                  "Invalid upload: Please ensure that the image is in PNG format, is no more than 10MB in size and has a filename no longer than 92 characters."
                              });
                            }
                          },
                          () => {
                            // complete function
                            storage
                              .ref()
                              .child(image.name)
                              .getDownloadURL()
                              .then(url => {
                                this.setState({
                                  urlString: url,
                                  isConfirmed: true,
                                  uploading: false,
                                  error: null
                                });
                                addImage({
                                  variables: {
                                    image_url: urlString,
                                    blurb: "no blurb",
                                    wall_id: Number(wall_id),
                                    artist_id: ARTIST_ID
                                  }
                                })
                                  .then(res => console.log(res))
                                  .catch(err => console.log(err));
                              });
                          }
                        );
                      }}
                    >
                      <p className="select-label">Choose a wall:</p>
                      <select
                        className="drop-down"
                        onChange={this.handleSelectChange}
                      >
                        <Query
                          query={gql`
                            {
                              fetchAllWalls {
                                wall_id
                                street_address
                                canvas_width
                                canvas_height
                                canvas_url
                              }
                            }
                          `}
                        >
                          {this.handleQuery}
                        </Query>
                      </select>
                      <p className="upload-label">Upload your artwork:</p>
                      <input
                        type="file"
                        onChange={this.handleChange}
                        className="upload"
                      />
                      <button type="submit" className="submit">
                        SUBMIT
                        <div className="ripples">
                          <span className="circle" />
                        </div>
                      </button>
                    </form>
                    {this.state.isConfirmed && (
                      <p>
                        Thank you. <br />
                        Your ARt has been uploaded to the wall!
                      </p>
                    )}
                    {uploading && (
                      <p className="uploading">Uploading image...</p>
                    )}
                    {this.state.error !== null && !uploading && (
                      <p className="error">{this.state.error}</p>
                    )}
                  </div>
                );
              }}
            </Mutation>
          </div>
        </Grid>
      </Grid>
    );
  }

  handleQuery = ({ loading, error, data }) => {
    if (loading) return <option>Loading...</option>;
    if (error) return <option>Error :(</option>;
    return data.fetchAllWalls.map(wall => (
      <option
        value={wall.wall_id}
        key={wall.wall_id}
        data_url={wall.canvas_url}
      >
        Address: {wall.street_address} Dimensions: {wall.canvas_width} x{" "}
        {wall.canvas_height}m
      </option>
    ));
  };

  handleChange = event => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      this.setState(() => ({ image }));
    }
  };

  handleSelectChange = event => {
    const { target } = event;
    this.setState({
      wall_id: target.value,
      canvas_url: target[target.value - 1].getAttribute("data_url"),
      wall_address: target[target.value - 1].innerText
    });
  };

  // handleUpload = event => {};
}

export default Upload;
