import React, { Component } from 'react';

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
        return (
            <div>
                <h1>Upload page</h1>
            </div>
        );
    }
}

export default Upload;