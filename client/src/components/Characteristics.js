import React from 'react';
import PageNavbar from './PageNavbar';
import CharacteristicRow from './CharacteristicRow';
import '../style/Characteristics.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Characteristics extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedCharacteristic: "",
			characteristics: [],
			songs: []
		};

		this.submitCharacteristic = this.submitCharacteristic.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	/* ---- Q3a (Best Genres) ---- */
	componentDidMount() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/characteristics",
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
		  // Map each genreObj in genreList to an HTML element:
		  // A button which triggers the showMovies function for each genre.
		  let characteristicDivs = characteristicList.map((characteristicObj, i) =>
		//   <option value={characteristicObj.characteristic}>{characteristicObj.characteristic}</option> 
		  <option value={characteristicObj.COLUMN_NAME}>{characteristicObj.COLUMN_NAME}</option>  
		  );

	
		  
	
		  // Set the state of the genres list to the value returned by the HTTP response from the server.
		  this.setState({
		// characteristics: characteristicDivs
		characteristics: [<option value={'uplifting'}>{'uplifting'}</option>,<option value={'calming'}>{'calming'}</option>,<option value={'highenergy'}>{'highenergy'}</option>]
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

	/* ---- Q3b (Best Genres) ---- */
	submitCharacteristic() {
		// var fixed = this.state.selectedCharacteristic.replace(/\//g,"-")

		fetch("http://localhost:8081/characteristics/" + this.state.selectedCharacteristic,
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
					<CharacteristicRow song_title={song.song_title} artist_name={song.artist_name} acousticness={song.acousticness} danceability={song.danceability}/>
				</div>
				
			);

			this.setState({
				songs: songDivs
			});
		});
	}

	render() {

		return (
			<div className="Characteristics">
				<PageNavbar active="characteristics" />

				<div className="container characteristics-container">
			      <div className="jumbotron">
			        <div className="h5">Characteristics</div>

			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedCharacteristic} onChange={this.handleChange} className="dropdown" id="characteristicsDropdown">
			            	<option select value> -- select an option -- </option>
			            	{this.state.characteristics}
			            </select>
			            <button className="submit-btn" id="characteristicsSubmitBtn" onClick={this.submitCharacteristic}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="song-container">
			          <div className="song">
			            <div className="header"><strong>Song Title</strong></div>
						<div className="header"><strong>Artist Name</strong></div>
						<div className="header"><strong>Acousticness</strong></div>
						<div className="header"><strong>Danceability</strong></div>
			          </div>
			          <div className="song-container" id="results">
			            {this.state.songs}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}