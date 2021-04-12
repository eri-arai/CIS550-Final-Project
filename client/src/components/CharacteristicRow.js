import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BillboardRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="songResults">
				<div className="name">{this.props.name}</div>
				<div className="artists">{this.props.artists}</div>
				<div className="acousticness">{this.props.acousticness}</div>
				<div className="danceability">{this.props.danceability}</div>
			</div>
		);
	}
}
