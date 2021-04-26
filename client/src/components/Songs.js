import React from 'react';
import PageNavbar from './PageNavbar';
import SongsRow from './SongsRow';
import '../style/Songs.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Songs extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected song name,
		// and the list of recommended songs.
		this.state = {
			songName: "",
			recSongs: []
		}

		this.handleSongNameChange = this.handleSongNameChange.bind(this);
		this.submitSong = this.submitSong.bind(this);
	}

	handleSongNameChange(e) {
		this.setState({
			songName: e.target.value
		});
	}

	submitSong() {
		this.setState({
			recSongs: ''
		});
		if (this.state.songName === undefined | this.state.songName == ''){
			// this.songName = '';
			console.log('Invalid');
		} else {

			console.log("http://localhost:8081/songs/" + this.state.songName);

			fetch("http://localhost:8081/songs/" + this.state.songName,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(songsList => {
				console.log(songsList); //displays your JSON object in the console
				
				if (songsList.length > 0){
					let songsDivs = songsList.map((song, i) => 
						// <RecommendationsRow key={recommendation.id} song={recommendation} />
						<div id="results" key={i} className="results-container">
							{/* <SongsRow song_title={song.song_title} artist_name={song.artist_name} acousticness={song.acousticness} danceability={song.danceability}/> */}
							<SongsRow song_title={song.song_title} artist_name={song.artist_name} week_position={song.week_position} peak_position={song.peak_position} weeks_on_chart={song.weeks_on_chart}
							release_date={song.release_date} release_year={song.release_year} acousticness={song.acousticness} danceability={song.danceability} 
							duration_ms={song.duration_ms} energy={song.energy} explicit={song.explicit} instrumentalness={song.instrumentalness} musical_key={song.musical_key}
							liveness={song.liveness} loudness={song.loudness} mode={song.mode} popularity={song.popularity} speechiness={song.speechiness} 
							tempo={song.tempo} valence={song.valence} genre={song.genre} spotify_id = {song.spotify_id}/>
						</div>
						
					);

					this.setState({
						recSongs: songsDivs
					});
				} else {
					fetch("http://localhost:8081/songsv/" + this.state.songName,
				{
					method: "GET"
				}).then(res => {
					return res.json();
				}, err => {
					console.log(err);
				}).then(songsList => {
					console.log(songsList); //displays your JSON object in the console
					let songsDivs = songsList.map((song, i) => 
						<div id="results" key={i} className="results-container">
							<SongsRow song_title={song.song_title} artist_name={song.artist_name} week_position={song.week_position} peak_position={song.peak_position} weeks_on_chart={song.weeks_on_chart}
							release_date={song.release_date} release_year={song.release_year} acousticness={song.acousticness} danceability={song.danceability} 
							duration_ms={song.duration_ms} energy={song.energy} explicit={song.explicit} instrumentalness={song.instrumentalness} musical_key={song.musical_key}
							liveness={song.liveness} loudness={song.loudness} mode={song.mode} popularity={song.popularity} speechiness={song.speechiness} 
							tempo={song.tempo} valence={song.valence} genre={song.genre} spotify_id = {song.spotify_id}/>
						</div>
						
					);

					this.setState({
						recSongs: songsDivs
					});
				});
				}

			});
		}
	}

	
	render() {

		return (
			<div className="Songs">
				<PageNavbar active="songs" />

			    <div className="container songs-container">
					<center>
			    	<div className="jumbotron"> 
					<div className="h2">Song Search</div>
					<br></br>
			    		<div className="h6">Have a song in mind? Find it now using our <b>song search.</b></div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Song Name" value={this.state.songName} onChange={this.handleSongNameChange} id="songName" className="Song-input"/>
			    			<button id="submitSongBtn" className="button" onClick={this.submitSong}>Submit</button>
			    		</div>
			    	</div>
					</center>
					<div className="jumbotron">
						<div className="song-container">
							<div className="song">
								<div className="header"><strong>Song Title</strong></div>
								<div className="header"><strong>Artist Name</strong></div>
								{/* <div className="header"><strong>Genre</strong></div> */}
								{/* <div className="header"><strong>Peak Position</strong></div>
								<div className="header"><strong>Weeks On Chart</strong></div> */}
							</div>
							<div className="song-container" id="results">
								{this.state.recSongs}
							</div>
						</div>
			      	</div>
			    </div>
		    </div>
		);
	}
}