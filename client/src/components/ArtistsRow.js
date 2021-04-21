import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { slideDown, slideUp } from './Collapse';
import ArtistsInnerRow from './ArtistsInnerRow';


export default class ArtistsRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			artistName: this.props.artist_name,
			recArtistsInner: []
		}
	}
	
	state = { expanded: false }

	

	// test
	submitArtistInner() {
		fetch("http://localhost:8081/artists_top_songs/" + this.state.artistName,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(artistsList => {
			console.log(artistsList); //displays your JSON object in the console

			let artistsDivs = artistsList.map((artist, i) => 
				<div id="results" key={i} className="results-container">
					<ArtistsInnerRow song_title={artist.song_title} artist_name={artist.artist_name} peak_position={artist.peak_position} weeks_on_chart={artist.weeks_on_chart}
					release_date={artist.release_date} release_year={artist.release_year} />
				</div>
				
			);

			this.setState({
				recArtistsInner: artistsDivs
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
			  this.submitArtistInner();
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
			return [
				
				<tr key="main" onClick={this.toggleExpander}>
					<div className="songResults">
						<div className="data">{this.props.artist_name}</div>
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
							<hr></hr>
							<div className="headers">
								<div className="header"><strong>Top Songs</strong></div>
								<div className="header"><strong>Top Weeks On Chart: {this.props.weeks_on_chart}</strong></div>
								<div className="header"><strong>Top Peak Position: {this.props.peak_position}</strong></div>
							</div>
						  	<div className="results-container" id="results">
			    				{this.state.recArtistsInner}
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
				<div className="data">{this.props.artist_name}</div>
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
							<div className="header"><strong>Top Songs</strong></div>
							<div className="header"><strong>Top Weeks On Chart: {this.props.weeks_on_chart}</strong></div>
							<div className="header"><strong>Top Peak Position: {this.props.peak_position}</strong></div>
						</div>
						<div className="results-container" id="results">
							{this.state.recArtistsInner}
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