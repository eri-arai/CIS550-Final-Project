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

	/* ---- Q2 (Songs) ---- */
	// Hint: Name of song submitted is contained in `this.state.songName`.
	submitSong() {
		// console.log("HI");
		fetch("http://localhost:8081/songs/" + this.state.songName,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(songsList => {
			console.log(songsList); //displays your JSON object in the console
			let songsDivs = songsList.map((song, i) => 
				// <RecommendationsRow key={recommendation.id} song={recommendation} />
				<div id="results" key={i} className="results-container">
					<SongsRow name={song.name} artists={song.artists} acousticness={song.acousticness} danceability={song.danceability}/>
				</div>
				
			);

			this.setState({
				recSongs: songsDivs
			});
		});
	}

	
	render() {

		return (
			<div className="Songs">
				<PageNavbar active="songs" />

			    <div className="container songs-container">
			    	<div className="jumbotron">
			    		<div className="h5">Songs</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Song Name" value={this.state.songName} onChange={this.handleSongNameChange} id="songName" className="Song-input"/>
			    			<button id="submitSongBtn" className="submit-btn" onClick={this.submitSong}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    			{/* <div className="h6">You may like ...</div> */}
			    			<div className="headers">
			    				<div className="header"><strong>Title</strong></div>
			    				<div className="header"><strong>Artists</strong></div>
					            <div className="header"><strong>Acousticness</strong></div>
					            <div className="header"><strong>Danceability</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recSongs}
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}
}