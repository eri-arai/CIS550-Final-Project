import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { slideDown, slideUp } from './Collapse';


export default class BillboardRow extends React.Component {
	constructor(props) {
		super(props);
	}
	
	state = { expanded: false }
  
	toggleExpander = (e) => {
  
	  if (!this.state.expanded) {
		this.setState(
		  { expanded: true },
		  () => {
			if (this.refs.expanderBody) {
			  slideDown(this.refs.expanderBody);
			}
		  }
		);
	  } else {
		slideUp(this.refs.expanderBody, {
		  onComplete: () => { this.setState({ expanded: false }); }
		});
	  }
	}
  
	render() {
		const { user } = this.props;

		var genre, release_date, release_year = '';
		if (this.props.genre == ''){
			genre = 'Unknown'
		} else {
			genre = this.props.genre;
		}
		if (this.props.release_date == ''){
			release_date = 'Unknown'
		} else {
			release_date = this.props.release_date;
		}
		if (this.props.release_year == 0){
			release_year = 'Unknown'
		} else {
			release_year = this.props.release_year;
		}

		// this will handle songs that have musical characteristics
		if (this.props.duration_ms > 0) {
			// All of these are necessary with SpotifyProject, but not with SpotifyProject2
			var explicit = '';
			if (this.props.explicit == 1) {
				explicit = 'Yes';
			} else if (this.props.explicit == 0) {
				explicit = 'No';
			} else {
				explicit = this.props.explicit;
			}
			var mode = '';
			if (this.props.mode == 1) {
				mode = 'Major';
			} else if (this.props.mode == 0) {
				mode = 'Minor';
			} else {
				mode = this.props.mode;
			}
			var musical_key = '';
			switch(this.props.musical_key){
				case 0:
					musical_key = 'C'
					break;
				case 1:
					musical_key = 'C#'
					break;
				case 2:
					musical_key = 'D'
					break;
				case 3:
					musical_key = 'D#'
					break;
				case 4:
					musical_key = 'E'
					break;
				case 5:
					musical_key = 'F'
					break;
				case 6:
					musical_key = 'F#'
					break;
				case 7:
					musical_key = 'G'
					break;
				case 8:
					musical_key = 'G#'
					break;
				case 9:
					musical_key = 'A'
					break;
				case 10:
					musical_key = 'A#'
					break;
				case 11:
					musical_key = 'B'
					break;
				default:
					musical_key = this.props.musical_key;
					break;
			}
			var spotify_link = "https://open.spotify.com/track/" + this.props.spotify_id;
			return [
				
				<tr key="main" onClick={this.toggleExpander}>
					<div className="songResults">
						<div className="data">{this.props.week_position}</div>
						<div className="data">{this.props.song_title}</div>
						<div className="data">{this.props.artist_name}</div>
					</div>
				</tr>,
				this.state.expanded && (
				  <tr className="expandable" key="tr-expander">
					<td className="uk-background-muted" colSpan={6}>
					  <div ref="expanderBody" className="inner uk-grid">
						<div className="uk-width-3-4">
						  <div className="songResults">
							<div className="peak_position">Peak Position: {this.props.peak_position}</div>
							<div className="weeks_on_chart">Weeks On Chart: {this.props.weeks_on_chart}</div>
							<div className="data">Release Date: {release_date}</div>
							<div className="data">Release Year: {release_year}</div>
						  </div>
						  <div className="songResults">
							<div className="data">Acousticness: {this.props.acousticness}</div>
							<div className="data">Danceability: {this.props.danceability}</div>
							<div className="data">Duration: {this.props.duration_ms} ms</div>
							<div className="data">Energy: {this.props.energy}</div>
						  </div>
						  <div className="songResults">
							{/* <div className="data">Explicit: {this.props.explicit}</div> */}
							<div className="data">Explicit: {explicit}</div>
							<div className="data">Genre: {genre}</div>
							<div className="data">Instrumentalness: {this.props.instrumentalness}</div>
							<div className="data">Liveness: {this.props.liveness}</div>
						  </div>
						  <div className="songResults">
							<div className="data">Loudness: {this.props.loudness}</div>
							{/* <div className="data">Mode: {this.props.mode}</div> */}
							<div className="data">Mode: {mode}</div>
							{/* <div className="data">Musical key: {this.props.musical_key}</div> */}
							<div className="data">Musical key: {musical_key}</div>
							<div className="data">Popularity: {this.props.popularity}</div>
						  </div>
						  <div className="songResults">
							<div className="data">Speechiness: {this.props.speechiness}</div>
							<div className="data">Tempo: {this.props.tempo}</div>
							<div className="data">Valence: {this.props.valence}</div>
						  	<div className="data"><a href={spotify_link} target="_blank">Find it on Spotify</a></div>
						  </div>
						</div>
					  </div>
					</td>
				  </tr>
				)
			  ];
	} else {
		return [
			<tr key="main" onClick={this.toggleExpander}>
			  <div className="songResults">
				<div className="data">{this.props.week_position}</div>
				<div className="data">{this.props.song_title}</div>
				<div className="data">{this.props.artist_name}</div>
			  </div>	
			  
			</tr>,
			this.state.expanded && (
			  <tr className="expandable" key="tr-expander">
				<td className="uk-background-muted" colSpan={6}>
				  <div ref="expanderBody" className="inner uk-grid">
					<div className="uk-width-3-4">
					  <div className="songResults">
						<div className="peak_position">Peak Position: {this.props.peak_position}</div>
						<div className="weeks_on_chart">Weeks On Chart: {this.props.weeks_on_chart}</div>
						<div className="data">Release Date: {release_date}</div>
						<div className="data">Release Year: {release_year}</div>
					  </div>
					  <div className="songResults">
						<div className="data">Genre: {genre}</div>
					  </div>
					  
					</div>
				  </div>
				</td>
			  </tr>
			)
		  ];
	  }
	}
  }
