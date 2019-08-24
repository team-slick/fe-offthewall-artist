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
    uploading: null,
    error: null
  };

  render() {
    const {
      wall_id,
      canvas_url,
      wall_address,
      uploading
    } = this.state;
    const { USERNAME, AUTH_TOKEN } = localStorage;
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
            <Mutation mutation={ADD_IMAGE} context={{ headers: {authorization: AUTH_TOKEN }}}>
              {(addImage, { loading, error, data }) => {
                return (
                  <div>
                    <p>
                      Welcome, <b>{USERNAME}</b>!
                    </p>
                    <p>
                      Please select a wall from the list below. Then, you can download the image displayed on the left and use your preferred image editing software to position your art on the wall.
                    </p>
                    <p>
                      Finally, remove the wall image layer and save the image as a PNG with transparency.
                    </p>
                    <p>
                      Please ensure that the file is no more than 10MB and the filename is no longer than 92 characters before uploading it.
                    </p>
                    <form
                      className="form"
                      onSubmit={event => {
                        event.preventDefault();
                        this.handleSubmit(addImage);
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
                      <p className="uploading">Uploading image: {uploading}</p>
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
    return (<>
      <option
        value={0}
        key={0}
        data_url=""
      >Please select a wall...</option>
      {data.fetchAllWalls.map(wall => (
          <option
            value={wall.wall_id}
            key={wall.wall_id}
            data_url={wall.canvas_url}
          >
            Address: {wall.street_address} Dimensions: {wall.canvas_width} x{" "}
            {wall.canvas_height}m
          </option>
        ))}
      </>);
  };

  handleChange = event => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      this.setState(() => ({ image }));
    }
  };

  handleSelectChange = event => {
    const { target } = event;
    const value = parseInt(target.value);
    this.setState({
      wall_id: value && value,
      canvas_url: value && target[value].getAttribute("data_url"),
      wall_address: value ? target[value].innerText : ""
    });
  };

  handleSubmit = addImage => {
    const { image, wall_id } = this.state;
    const { USERNAME } = localStorage;
    const filename = `${wall_id}_${USERNAME}_${image.name}`;
    const uploadTask = storage
      .ref(filename)
      .put(image);
    uploadTask.on(
      "state_changed",
      ({ bytesTransferred, totalBytes }) => {
        // progress function
        this.setState({ uploading: `${Math.ceil(bytesTransferred / totalBytes * 100)}%` });
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
          .child(filename)
          .getDownloadURL()
          .then(url => {
            addImage({
              variables: {
                image_url: url,
                blurb: "no blurb",
                wall_id
              }
            })
            .then(res => this.setState({
                urlString: url,
                isConfirmed: true,
                uploading: null,
                error: null
            }))
            .catch(err => {
              // needs to delete FB url if db post fails
              const error = (err.errors && err.errors.length) ? err.errors[0].message : 'Server Error: Upload failed. Please try again.';
              this.setState({
                uploading: null,
                error
              });
            });
        });
      }
    );
  }
}

export default Upload;
