import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PlaylistRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="songResults">
				<div className="song_title">{this.props.song_title}</div>
				<div className="artist_name">{this.props.artist_name}</div>
			</div>
		);
	}
}
