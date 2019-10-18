import React, { Component } from 'react';
import { Query } from '@apollo/react-components';
import { gql } from 'apollo-boost';
import { storage } from '../firebase';
import '../styles/styles.scss';
import '../styles/main.scss';
import logo from '../images/artlogo.png';

class Upload extends Component {
    state = {
        image: null,
        urlString: "",
        wall_id: null,
        wall_address: '',
        isConfirmed: false,
        canvas_url: ''
    };

    render() {
        const { wall_id, canvas_url, wall_address } = this.state;
        return (
            <main>
                <img src={logo} alt={"ARt:Leeds logo"} />
                <div className="container">
                    <Query query={gql`
                {
                fetchAllWalls {
                    wall_id
                    street_address
                    canvas_width
                    canvas_height
                    canvas_url
                    }
                }`}>{this.handleQuery}
                    </Query>
                </div>





                <input type="file" onChange={this.handleChange} />
                <button onClick={this.handleUpload}>Submit</button>
            </main>
            // {this.state.isConfirmed && <p>Thank you,<br />Your ARt has been uploaded to the wall!</p>}
        );
    }


    handleQuery = ({ loading, error, data }) => {
        if (loading) return <h2>Loading wall images..</h2>
        if (error) return <h1>Error :(</h1>
        return data.fetchAllWalls.map(
            wall => (
                <div className="wall-card" key={wall.wall_id}>
                    <div className="wall-info">
                        <strong>{wall.street_address}</strong>
                        <p>{wall.canvas_width} x {wall.canvas_height}m</p>
                    </div>
                    <img onClick={this.handleSelectChange} value={wall.wall_id} data_url={wall.canvas_url} src={wall.canvas_url} alt={`${wall.street_address}`} className="wall-card__image"></img>
                </div>
            )
        );
    }

    handleChange = event => {
        if (event.target.files[0]) {
            const image = event.target.files[0];
            this.setState(() => ({ image }));
        }
    }

    handleSelectChange = event => {
        const { target } = event
        this.setState({
            wall_id: target.getAttribute('value'),
            canvas_url: target.getAttribute('data_url'),
            wall_address: target.getAttribute('alt')
        })
    }

    handleUpload = (event) => {
        event.preventDefault();
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
                        this.setState({ urlString: url, isConfirmed: true })
                    })
            }
        );
    }

}

export default Upload;