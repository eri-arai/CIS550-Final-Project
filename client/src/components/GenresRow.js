import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { slideDown, slideUp } from './Collapse';
import GenresInnerRow from './GenresInnerRow';


export default class GenresRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			genreName: this.props.genre,
			recGenresInner: []
		}
	}
	
	state = { expanded: false }

	
	// test
	submitGenreInner() {
		console.log("http://localhost:8081/genres_top_songs/" + this.state.genreName);

		fetch("http://localhost:8081/genres_top_songs/" + this.state.genreName,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(genresList => {
			console.log(genresList); //displays your JSON object in the console

			let genresDivs = genresList.map((genre, i) => 
				<div id="results" key={i} className="results-container">
					<GenresInnerRow song_title={genre.song_title} artist_name={genre.artist_name} peak_position={genre.peak_position} weeks_on_chart={genre.weeks_on_chart}
					release_date={genre.release_date} release_year={genre.release_year} />
				</div>
			);

			this.setState({
				recGenresInner: genresDivs
			});
		});
	}
	
	toggleExpander = (e) => {
  
	  if (!this.state.expanded) {
		this.setState(
		  { expanded: true },
		  () => {
			if (this.refs.expanderBody) {
			  slideDown(this.refs.expanderBody);
			  this.submitGenreInner();
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

		// this will handle songs that have musical characteristics
		if (this.props.duration_ms > 0) {
			return [
				
				<tr key="main" onClick={this.toggleExpander}>
					<div className="songResults">
						<div className="data">{this.props.genre}</div>
						<div className="data">{this.props.songs_in_database}</div>
					</div>
				</tr>,
				this.state.expanded && (
				  <tr className="expandable" key="tr-expander">
					<td className="uk-background-muted" colSpan={6}>
					  <div ref="expanderBody" className="inner uk-grid">
						<div className="uk-width-3-4">
							<div className="headers">
								<div className="header"><strong>Average Musical Characteristics</strong></div>
							</div>
						  
						  <div className="songResults">
							<div className="data">Acousticness: {this.props.acousticness}</div>
							<div className="data">Danceability: {this.props.danceability}</div>
							<div className="data">Duration: {this.props.duration_ms} ms</div>
						  </div>
						  <div className="songResults">
							<div className="data">Energy: {this.props.energy}</div>
							<div className="data">Instrumentalness: {this.props.instrumentalness}</div>
							<div className="data">Liveness: {this.props.liveness}</div>
						  </div>
						  <div className="songResults">
							<div className="data">Loudness: {this.props.loudness}</div>
							<div className="data">Popularity: {this.props.popularity}</div>
							<div className="data">Speechiness: {this.props.speechiness}</div>
						  </div>
						  <div className="songResults">
							<div className="data">Tempo: {this.props.tempo}</div>
							<div className="data">Valence: {this.props.valence}</div>
							<div className="data"></div>
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

							<hr></hr>
							<div className="headers">
								<div className="header"><strong>Top Artists</strong></div>
								<div className="header"><strong>Top Songs</strong></div>
								<div className="header"><strong>Top Weeks On Chart: {this.props.weeks_on_chart}</strong></div>
								<div className="header"><strong>Top Peak Position: {this.props.peak_position}</strong></div>
							</div>
							
						  	<div className="results-container" id="results">
			    				{this.state.recGenresInner}
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
					<div className="data">{this.props.genre}</div>
					<div className="data">{this.props.songs_in_database}</div>
				</div>
			  
			</tr>,
			this.state.expanded && (
			  <tr className="expandable" key="tr-expander">
				<td className="uk-background-muted" colSpan={6}>
				  <div ref="expanderBody" className="inner uk-grid">
					<div className="uk-width-3-4">					  
						<div className="headers">
							<div className="header"><strong>Top Artists</strong></div>
							<div className="header"><strong>Top Songs</strong></div>
							<div className="header"><strong>Top Weeks On Chart: {this.props.weeks_on_chart}</strong></div>
							<div className="header"><strong>Top Peak Position: {this.props.peak_position}</strong></div>
						</div>
						<div className="results-container" id="results">
							{this.state.recGenresInner}
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