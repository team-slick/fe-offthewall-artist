import React, { Component } from 'react';
import { Query } from '@apollo/react-components';
import { gql } from 'apollo-boost';
import { storage } from '../firebase';
import '../styles/styles.scss'
import logo from '../images/artlogo.png'

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
            <div>
                <div>
                    <img src={wall_id ? canvas_url : logo} alt={wall_id ? wall_address : "ARt:Leeds logo"} />
                </div>
                <h1>Upload page</h1>
                <form>
                    <select onChange={this.handleSelectChange}>
                        <Query query={gql`
                    {
                    fetchAllWalls {
                    wall_id
                    street_address
                    canvas_width
                    canvas_height
                    canvas_url
                    }
                    }`}>
                            {this.handleQuery}
                        </Query>
                    </select>
                    <input type="file" onChange={this.handleChange} />
                    <button onClick={this.handleUpload}>Submit</button>
                </form>
                {this.state.isConfirmed && <p>Thank you,<br />Your ARt has been uploaded to the wall!</p>}
            </div>
        );
    }

    handleQuery = ({ loading, error, data }) => {
        if (loading) return <option>Loading...</option>
        if (error) return <option>Error :(</option>
        return data.fetchAllWalls.map(
            wall => (
                <option value={wall.wall_id} key={wall.wall_id} data_url={wall.canvas_url} >Address: {wall.street_address} - Dimensions: {wall.canvas_width} x {wall.canvas_height}m
                </option>
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
            wall_id: target.value,
            canvas_url: target[target.value - 1].getAttribute("data_url"),
            wall_address: target[target.value - 1].innerText
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