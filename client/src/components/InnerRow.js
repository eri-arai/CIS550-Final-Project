import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { slideDown, slideUp } from './Collapse';


export default class InnerRow extends React.Component {
	constructor(props) {
		super(props);
	}
	
	
  
	render() {
		console.log("Spotify_id = ", this.props.spotify_id);

		// console.log("We made it here");

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

			var acoVar, danVar, durVar, eneVar, insVar, livVar, louVar, popVar, speVar, temVar, valVar = '';

			if (this.props.acousticness > 0.66){
				acoVar = 'success'
			} else if (this.props.acousticness < 0.33){
				acoVar = 'danger'
			} else {
				acoVar = 'warning'
			}

			if (this.props.danceability > 0.66){
				danVar = 'success'
			} else if (this.props.danceability < 0.33){
				danVar = 'danger'
			} else {
				danVar = 'warning'
			}

			// var normDur = 50*Math.log(100/5333365*(this.props.duration_ms - 4937))/Math.log(10);
			var normDur = 50*Math.log(100/1500000*(this.props.duration_ms - 4937))/Math.log(10);
			if (normDur > 66){
				durVar = 'success'
			} else if (normDur < 33){
				durVar = 'danger'
			} else {
				durVar = 'warning'
			}

			if (this.props.energy > 0.66){
				eneVar = 'success'
			} else if (this.props.energy < 0.33){
				eneVar = 'danger'
			} else {
				eneVar = 'warning'
			}

			var normInst = 50*Math.log(100*this.props.instrumentalness)/Math.log(10);
			if (normInst > 66){
				insVar = 'success'
			} else if (normInst < 33){
				insVar = 'danger'
			} else {
				insVar = 'warning'
			}

			var normLive = 50*Math.log(100*this.props.liveness)/Math.log(10);
			if (normLive > 66){
				livVar = 'success'
			} else if (normLive < 33){
				livVar = 'danger'
			} else {
				livVar = 'warning'
			}

			var normLoud = 100/64*(this.props.loudness + 60);
			if (normLoud > 66){
				louVar = 'success'
			} else if (normLoud < 33){
				louVar = 'danger'
			} else {
				louVar = 'warning'
			}

			if (this.props.popularity > 66){
				popVar = 'success'
			} else if (this.props.popularity < 33){
				popVar = 'danger'
			} else {
				popVar = 'warning'
			}

			var normSpeech = 50*Math.log(100*this.props.speechiness)/Math.log(10);
			if (normSpeech > 66){
				speVar = 'success'
			} else if (normSpeech < 33){
				speVar = 'danger'
			} else {
				speVar = 'warning'
			}

			var normTemp = 100/243.5*(this.props.tempo);
			if (normTemp > 66){
				temVar = 'success'
			} else if (normTemp < 33){
				temVar = 'danger'
			} else {
				temVar = 'warning'
			}

			if (this.props.valence > 0.66){
				valVar = 'success'
			} else if (this.props.valence < 0.33){
				valVar = 'danger'
			} else {
				valVar = 'warning'
			}
			
				
			var spotify_link = "https://open.spotify.com/track/" + this.props.spotify_id;
			return [
				
				
				<div className="uk-width-3-4">
					<div className="songResults">
						<div className="data">Peak Position: {this.props.peak_position}</div>
						<div className="data">Weeks On Chart: {this.props.weeks_on_chart}</div>
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

					<div className="headers">
						<br></br>
						<div className="header"><strong>Bar Chart of Musical Characteristics</strong></div>
					</div>

					<ProgressBar variant={acoVar} now={100*this.props.acousticness} label={`Acousticness`}></ProgressBar>
							<ProgressBar variant={danVar} now={100*this.props.danceability} label={`Danceability`}></ProgressBar>
							<ProgressBar variant={durVar} now={normDur} label={`Duration`}></ProgressBar>
							<ProgressBar variant={eneVar} now={100*this.props.energy} label={`Energy`}></ProgressBar>
							<ProgressBar variant={insVar} now={normInst} label={`Instrumentalness`}></ProgressBar>
							<ProgressBar variant={livVar} now={normLive} label={`Liveness`}></ProgressBar>
							<ProgressBar variant={louVar} now={normLoud} label={`Loudness`}></ProgressBar>
							<ProgressBar variant={popVar} now={this.props.popularity} label={`Popularity`}></ProgressBar>
							<ProgressBar variant={speVar} now={normSpeech} label={`Speechiness`}></ProgressBar>
							<ProgressBar variant={temVar} now={normTemp} label={`Tempo`}></ProgressBar>
							<ProgressBar variant={valVar} now={100*this.props.valence} label={`Valence`}></ProgressBar>



			  </div>
			  ];
	} else {
		return [
			// <tr key="main" onClick={this.toggleExpander}>
			//   <div className="songResults">
			// 	<div className="week_position">{this.props.week_position}</div>
			// 	<div className="data">{this.props.song_title}</div>
			// 	<div className="data">{this.props.artist_name}</div>
			//   </div>	
			// </tr>,
			<div className="uk-width-3-4">
				<div className="songResults">
					<div className="data">Peak Position: {this.props.peak_position}</div>
					<div className="data">Weeks On Chart: {this.props.weeks_on_chart}</div>
					<div className="data">Release Date: {release_date}</div>
					<div className="data">Release Year: {release_year}</div>
				</div>
					<div className="songResults">
					<div className="data">Genre: {genre}</div>
				</div>
			
		  	</div>
		  ];
	  }
	}
  }
