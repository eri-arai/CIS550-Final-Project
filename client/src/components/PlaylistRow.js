import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PlaylistRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var spotify_link = "https://open.spotify.com/track/" + this.props.spotify_id;
		console.log(this.props.spotify_id)

		return (
			<div className="songResults">
				<div className="song_title">{this.props.song_title}</div>
				<div className="artist_name">{this.props.artist_name}</div>
				<div className="data"><a href={spotify_link} target="_blank">Find it on Spotify</a></div>
			</div>
		);
	}
}
