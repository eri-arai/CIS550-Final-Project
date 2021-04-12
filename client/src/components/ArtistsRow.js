import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ArtistsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(this.props.song);

		return (
			<div className="artistResults">
				<div className="artist_name">{this.props.artist_name}</div>
				{/* <div className="week_id">{this.props.week_id}</div>
				<div className="peak_position">{this.props.peak_position}</div>
				<div className="weeks_on_chart">{this.props.weeks_on_chart}</div> */}
			</div>
		);
	}
}
