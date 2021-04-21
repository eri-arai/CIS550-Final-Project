import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { slideDown, slideUp } from './Collapse';


export default class ArtistsInnerRow extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		console.log(this.props.song);

		return (
			<div className="artistResults">
				{/* <div className="artist_inner_name">Artist: {this.props.artist_name}</div> */}
				<div className="week_id">{this.props.song_title}</div>
				<div className="weeks_on_chart">Weeks On Chart: {this.props.weeks_on_chart}</div>
				<div className="peak_position">Peak Position: {this.props.peak_position}</div>
			</div>
		);
	}
}

