import React from 'react';
import PageNavbar from './PageNavbar';
import ArtistsRow from './ArtistsRow';
import '../style/Artists.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Artists extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected artist name,
		// and the list of recommended artists.
		this.state = {
			artistName: "",
			recArtists: []
		}

		this.handleArtistNameChange = this.handleArtistNameChange.bind(this);
		this.submitArtist = this.submitArtist.bind(this);
	}

	handleArtistNameChange(e) {
		this.setState({
			artistName: e.target.value
		});
	}

	/* ---- Q2 (Artists) ---- */
	// Hint: Name of artist submitted is contained in `this.state.artistName`.
	submitArtist() {
		// console.log("HI");
		fetch("http://localhost:8081/artists/" + this.state.artistName,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(artistsList => {
			console.log(artistsList); //displays your JSON object in the console

			let artistsDivs = artistsList.map((artist, i) => 
				// <RecommendationsRow key={recommendation.id} artist={recommendation} />
				<div id="results" key={i} className="results-container">
					{/* <ArtistsRow artist_name={artist.artist_name}/> */}
					<ArtistsRow song_title={artist.song_title} artist_name={artist.artist_name} week_position={artist.week_position} peak_position={artist.peak_position} weeks_on_chart={artist.weeks_on_chart}
					release_date={artist.release_date} release_year={artist.release_year} acousticness={artist.acousticness} danceability={artist.danceability} 
					duration_ms={artist.duration_ms} energy={artist.energy} explicit={artist.explicit} instrumentalness={artist.instrumentalness} musical_key={artist.musical_key}
					liveness={artist.liveness} loudness={artist.loudness} mode={artist.mode} popularity={artist.popularity} speechiness={artist.speechiness} 
					tempo={artist.tempo} valence={artist.valence} genre={artist.genre} songs_in_database={artist.songs_in_database}/>
				</div>
				
			);

			this.setState({
				recArtists: artistsDivs
			});
		});
	}

	
	render() {

		return (
			<div className="Artists">
				<PageNavbar active="artists" />

			    <div className="container artists-container">
			    	<div className="jumbotron">
			    		<div className="h5">Artists</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Artist Name" value={this.state.artistName} onChange={this.handleArtistNameChange} id="artistName" className="Artist-input"/>
			    			<button id="submitArtistBtn" className="submit-btn" onClick={this.submitArtist}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    			{/* <div className="h6">You may like ...</div> */}
			    			<div className="headers">
			    				<div className="header"><strong>Artist Name</strong></div>

			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recArtists}
			    		</div>
			    	</div>

					<div className="jumbotron">
						<div className="header-container">
							<div className="headers">
								<div className="header"><strong>Artist Name</strong></div>
								<div className="header"><strong>Genre</strong></div>
								<div className="header"><strong>Songs in Database</strong></div>
								{/* <div className="header"><strong>Peak Position</strong></div>
								<div className="header"><strong>Weeks On Chart</strong></div> */}
							</div>
							<div className="artist-container" id="results">
								{this.state.recArtists}
							</div>
						</div>
			     	</div>

			    </div>
		    </div>
		);
	}
}

				