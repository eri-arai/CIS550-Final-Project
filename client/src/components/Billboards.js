import React from 'react';
import PageNavbar from './PageNavbar';
import BillboardRow from './BillboardRow';
import '../style/Billboards.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Billboards extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedBillboard: "",
			billboards: [],
			songs: []
		};

		this.submitBillboard = this.submitBillboard.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	/* ---- Billboards ---- */
	componentDidMount() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/billboards",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
      return res.json();
      
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(billboardList => {
		  if (!billboardList) return;
		  // Map each genreObj in genreList to an HTML element:
		  // A button which triggers the showMovies function for each genre.
		  let billboardDivs = billboardList.map((billboardObj, i) =>
		//   <option value={billboardObj.billboard}>{billboardObj.billboard}</option> 
		  <option value={billboardObj.week_id}>{billboardObj.week_id}</option>  
		  );
	
		  
	
		  // Set the state of the genres list to the value returned by the HTTP response from the server.
		  this.setState({
        billboards: billboardDivs
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});
	}

	handleChange(e) {
		this.setState({
			selectedBillboard: e.target.value
		});
	}

	submitBillboard() {
		var fixed = this.state.selectedBillboard.replace(/\//g,"-")

		// fetch("http://localhost:8081/billboards/" + this.state.selectedBillboard,
		fetch("http://localhost:8081/billboards/" + fixed,
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
					<BillboardRow song_title={song.song_title} artist_name={song.artist_name} week_position={song.week_position} peak_position={song.peak_position} weeks_on_chart={song.weeks_on_chart}
					release_date={song.release_date} release_year={song.release_year} acousticness={song.acousticness} danceability={song.danceability} 
					duration_ms={song.duration_ms} energy={song.energy} explicit={song.explicit} instrumentalness={song.instrumentalness} musical_key={song.musical_key}
					liveness={song.liveness} loudness={song.loudness} mode={song.mode} popularity={song.popularity} speechiness={song.speechiness} 
					tempo={song.tempo} valence={song.valence} genre={song.genre}/>
				</div>
				
			);

			this.setState({
				songs: songDivs
			});
		});
	}

	render() {

		return (
			<div className="Billboards">
				<PageNavbar active="billboards" />

				<div className="container billboards-container">
			      <div className="jumbotron">
			        <div className="h5">Billboards</div>

			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedBillboard} onChange={this.handleChange} className="dropdown" id="billboardsDropdown">
			            	<option select value> -- select a week -- </option>
			            	{this.state.billboards}
			            </select>
			            <button className="submit-btn" id="billboardsSubmitBtn" onClick={this.submitBillboard}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="song-container">
			          <div className="song">
			            <div className="header"><strong>Week Position</strong></div>
			            <div className="header"><strong>Song Title</strong></div>
						<div className="header"><strong>Artist Name</strong></div>
						{/* <div className="header"><strong>Peak Position</strong></div>
						<div className="header"><strong>Weeks On Chart</strong></div> */}
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