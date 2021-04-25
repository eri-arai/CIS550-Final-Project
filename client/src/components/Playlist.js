import React from 'react';
import PageNavbar from './PageNavbar';
import PlaylistRow from './PlaylistRow';
import '../style/Playlist.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdvancedRow from './AdvancedRow';

export default class Playlist extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedCharacteristic: "",
			songs: []
		};

		this.submitCharacteristic = this.submitCharacteristic.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	/* ---- Load ---- */
	componentDidMount() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/playlist",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
      return res.json();
      
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(characteristicList => {
		  if (!characteristicList) return;
	
		  // Set the state of the genres list to the value returned by the HTTP response from the server.
		  this.setState({
		// characteristics: characteristicDivs
		characteristics: [<option value={'Uplifting'}>{'Uplifting'}</option>,<option value={'Calming'}>{'Calming'}</option>,
		<option value={'Energetic'}>{'Energetic'}</option>, <option value={'Gloomy'}>{'Gloomy'}</option>, 
		<option value={'Acoustic'}>{'Acoustic'}</option>,<option value={'Dancing'}>{'Dancing'}</option>,
		<option value={'Happy'}>{'Happy'}</option>,<option value={'From the Stage'}>{'From the Stage'}</option>,
		<option value={'Spoken Word'}>{'Spoken Word'}</option>,<option value={'Anxious'}>{'Anxious'}</option>,
		<option value={'Work Out'}>{'Work Out'}</option>,]
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});
	}

	handleChange(e) {
		this.setState({
			selectedCharacteristic: e.target.value
		});
	}

	/* ---- Submit ---- */
	submitCharacteristic() {
		this.setState({
			songs: []
		});
		// var fixed = this.state.selectedCharacteristic.replace(/\//g,"-")

		if (this.state.selectedCharacteristic === undefined | this.state.selectedCharacteristic == ''){
			// this.selectedCharacteristic = '';
			console.log('Invalid');
		} else {
			console.log("http://localhost:8081/playlist/" + this.state.selectedCharacteristic);

			fetch("http://localhost:8081/playlist/" + this.state.selectedCharacteristic,
			// fetch("http://localhost:8081/characteristics/" + fixed,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(songList => {
				console.log(songList); //displays your JSON object in the console
				let songDivs = songList.map((song, i) => 
					// <RecommendationsRow key={recommendation.id} movie={recommendation} />
					<div id="results" key={i} className="results-container">
						{/* <PlaylistRow song_title={song.song_title} artist_name={song.artist_name} spotify_id={song.spotify_id}/> */}
						<AdvancedRow song_id={song.song_id} song_title={song.song_title} artist_name={song.artist_name} genre={song.genre} />
					</div>
					
				);

				this.setState({
					songs: songDivs
				});
			});
		}
	}

	render() {

		return (
			<div className="Playlist">
				<PageNavbar active="playlist" />

				<div className="container characteristics-container">
				<center>
			      <div className="jumbotron">
				    <div className="h2">Playlist Search</div>
					<br></br>
			        <div className="h6">Find a playlist that suits your <b>mood</b>.</div>
					<br></br>
			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedCharacteristic} onChange={this.handleChange} className="dropdown" id="characteristicsDropdown">
			            	<option select value> -- select an option -- </option>
			            	{this.state.characteristics}
			            </select>
			            <button className="button" id="characteristicsSubmitBtn" onClick={this.submitCharacteristic}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="song-container">
			          <div className="song">
			            <div className="header"><strong>Song Title</strong></div>
						<div className="header"><strong>Artist Name</strong></div>
						{/* <div className="header"><strong>Spotify Link</strong></div> */}
			          </div>
			          <div className="song-container" id="results">
			            {this.state.songs}
			          </div>
			        </div>
			      </div>
				  </center>
			    </div>
			</div>
		);
	}
}