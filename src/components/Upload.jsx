import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { storage } from "../firebase";
import "../styles/Upload.css";
import { Query } from "@apollo/react-components";
import { gql } from "apollo-boost";
import logo from "../images/artlogo.png";

const Upload = () => {
  const { ARTIST_ID, USERNAME } = localStorage;

  const [image, setImage] = useState(null);
  const [urlString, setUrlString] = useState("");
  const [wall_id, setWallId] = useState(null);
  const [wall_address, setWallAdress] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [canvas_url, setCanvasUrl] = useState("");
  const [walls, setWalls] = useState([]);

  const handleChange = event => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      setImage(image);
    }
  };

  const handleSelectChange = event => {
    const { target } = event;
    const chosenWall = walls.filter(wall => wall.wall_id === target.value);
    console.log(chosenWall);
    setWallId(chosenWall[0].wall_id);
    setCanvasUrl(chosenWall[0].canvas_url);
    setWallAdress(chosenWall[0].street_address);
  };

  const handleSubmit = event => {
    event.preventDefault();
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
            setUrlString(url);
            setIsConfirmed(true);
          });
      }
    );
  };

  const handleQuery = ({ loading, error, data }) => {
    if (loading) return <option>Loading...</option>;
    if (error) return <option>Error :(</option>;
    if (data && data.fetchAllWalls) {
      setWalls(data.fetchAllWalls);
    }
    return walls.map(wall => (
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
          <p>
            Welcome <b>{USERNAME}</b>, simply choose a wall from the list below
            and upload your art.
          </p>
          <form className="form">
            <p className="select-label">Choose a wall:</p>
            <select className="drop-down" defaultValue={"DEFAULT"} onChange={handleSelectChange}>
              <option disabled value="DEFAULT">--- select a wall ---</option>
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
                {handleQuery}
              </Query>
            </select>
            <p className="upload-label">Upload your artwork:</p>
            <input type="file" onChange={handleChange} className="upload" />
            <button className="submit" onClick={handleSubmit}>
              SUBMIT
              <div className="ripples">
                <span className="circle" />
              </div>
            </button>
          </form>
          {isConfirmed && (
            <p>
              Thank you. <br />
              Your ARt has been uploaded to the wall!
            </p>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default Upload;
