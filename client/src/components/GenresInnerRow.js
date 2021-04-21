import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { slideDown, slideUp } from './Collapse';


export default class GenresInnerRow extends React.Component {
	constructor(props) {
		super(props);

		
	}

	render() {
		console.log(this.props.song);

		return (
			<div className="genreResults">
				<div className="data">{this.props.artist_name}</div>
				<div className="data">{this.props.song_title}</div>
				<div className="weeks_on_chart">Weeks On Chart: {this.props.weeks_on_chart}</div>
				<div className="peak_position">Peak Position: {this.props.peak_position}</div>
			</div>
		);
	}
}

