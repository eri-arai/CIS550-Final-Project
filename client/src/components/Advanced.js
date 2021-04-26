import React from 'react';
import PageNavbar from './PageNavbar';
// import PlaylistRow from './PlaylistRow';
import AdvancedRow from './AdvancedRow';
import '../style/Playlist.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Advanced extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedAco: "",
			selectedDan: "",
			selectedDur: "",
			selectedEne: "",
			selectedExp: "",

			selectedIns: "",
			selectedLiv: "",
			selectedLou: "",
			selectedMod: "",
			selectedMus: "",

			selectedPop: "",
			selectedSpe: "",
			selectedTem: "",
			selectedVal: "",
			selectedDec: "",
			selectedPea: "",


			acos: [],
			dans: [],
			durs: [],
			enes: [],
			exps: [], 

			inss: [], 
			livs: [], 
			lous: [], 
			mods: [], 
			muss: [], 

			pops: [], 
			spes: [], 
			tems: [], 
			vals: [],
			decs: [],
			peas: [] 

		};

		this.submitAdvanced = this.submitAdvanced.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	
	/* ---- Advanced ---- */
	componentDidMount() {	

		// fetch("http://localhost:8081/billboardsy/",
		// {
		//   method: 'GET' // The type of HTTP request.
		// }).then(res => {
		//   // Convert the response data to a JSON.
      	// 	return res.json();
		// }, err => {
		//   // Print the error if there is one.
		//   console.log(err);
		// }).then(yearList => {
		//   if (!yearList) return;
		//   // Map each yearObj in genreList to an HTML element:
		//   let yearDivs = yearList.map((yearObj, i) =>
		//  	 <option value={yearObj.year}>{yearObj.year}</option>  
		//   );
		//   // Set the state of the years list to the value returned by the HTTP response from the server.
		//   this.setState({
        // 	years: yearDivs,
		// 	months: [<option value={'1'}>{'1'}</option>,<option value={'2'}>{'2'}</option>,
		// 	<option value={'3'}>{'3'}</option>, <option value={'4'}>{'4'}</option>, 
		// 	<option value={'5'}>{'5'}</option>,<option value={'6'}>{'6'}</option>,
		// 	<option value={'7'}>{'7'}</option>,<option value={'8'}>{'8'}</option>,
		// 	<option value={'9'}>{'9'}</option>,<option value={'10'}>{'10'}</option>,
		// 	<option value={'11'}>{'11'}</option>,<option value={'12'}>{'12'}</option>]
		//   });
		// }, err => {
		//   // Print the error if there is one.
		//   console.log(err);
		// });

		
		// console.log("http://localhost:8081/billboardsd/" + this.selectedYear + "/" + this.selectedMonth)

		// fetch("http://localhost:8081/billboardsd/" + this.selectedYear + "/" + this.selectedMonth,
		// {
		//   method: 'GET' // The type of HTTP request.
		// }).then(res => {
		//   // Convert the response data to a JSON.
      	// 	return res.json();
		// }, err => {
		//   // Print the error if there is one.
		//   console.log(err);
		// }).then(dayList => {
		//   if (!dayList) return;
		//   // Map each dayObj in genreList to an HTML element:
		//   let dayDivs = dayList.map((dayObj, i) =>
		//  	 <option value={dayObj.day}>{dayObj.day}</option>  
		//   );
		//   // Set the state of the days list to the value returned by the HTTP response from the server.
		//   this.setState({
        // 	days: dayDivs
		//   });
		// }, err => {
		//   // Print the error if there is one.
		//   console.log(err);
		// });


		this.setState({
			
			
			acos: [<option value={'1'}>{'High acousticness'}</option>, <option value={'2'}>{'Medium acousticness'}</option>, <option value={'3'}>{'Low acousticness'}</option>],
			dans: [<option value={'1'}>{'High danceability'}</option>, <option value={'2'}>{'Medium danceability'}</option>, <option value={'3'}>{'Low danceability'}</option>],
			durs: [<option value={'1'}>{'Long duration'}</option>, <option value={'2'}>{'Medium duration'}</option>, <option value={'3'}>{'Short duration'}</option>],
			enes: [<option value={'1'}>{'High energy'}</option>, <option value={'2'}>{'Medium energy'}</option>, <option value={'3'}>{'Low energy'}</option>],
			exps: [<option value={'1'}>{'Not explicit'}</option>, <option value={'2'}>{'Explicit'}</option>],

			inss: [<option value={'1'}>{'High instrumentalness'}</option>, <option value={'2'}>{'Medium instrumentalness'}</option>, <option value={'3'}>{'Low instrumentalness'}</option>],
			livs: [<option value={'1'}>{'High liveness'}</option>, <option value={'2'}>{'Medium liveness'}</option>, <option value={'3'}>{'Low livenless'}</option>],
			lous: [<option value={'1'}>{'Loud'}</option>, <option value={'2'}>{'Medium'}</option>, <option value={'3'}>{'Soft'}</option>],
			mods: [<option value={'1'}>{'Minor'}</option>, <option value={'2'}>{'Major'}</option>],
			muss: [<option value={'0'}>{'C'}</option>, <option value={'1'}>{'C#'}</option>, <option value={'2'}>{'D'}</option>, 
			<option value={'3'}>{'D#'}</option>, <option value={'4'}>{'E'}</option>, <option value={'5'}>{'F'}</option>, 
			<option value={'6'}>{'F#'}</option>, <option value={'7'}>{'G'}</option>, <option value={'8'}>{'G#'}</option>, 
			<option value={'9'}>{'A'}</option>, <option value={'10'}>{'A#'}</option>, <option value={'11'}>{'B'}</option>],

			pops: [<option value={'1'}>{'High popularity'}</option>, <option value={'2'}>{'Medium popularity'}</option>, <option value={'3'}>{'Low popularity'}</option>],
			spes: [<option value={'1'}>{'High speechiness'}</option>, <option value={'2'}>{'Medium speechiness'}</option>, <option value={'3'}>{'Low speechiness'}</option>],
			tems: [<option value={'1'}>{'Fast tempo'}</option>, <option value={'2'}>{'Medium tempo'}</option>, <option value={'3'}>{'Slow tempo'}</option>],
			vals: [<option value={'1'}>{'High valence'}</option>, <option value={'2'}>{'Medium valence'}</option>, <option value={'3'}>{'Low valence'}</option>],
			decs: [<option value={'1'}>{'2010s'}</option>, <option value={'2'}>{'2000s'}</option>, <option value={'3'}>{'1990s'}</option>
			, <option value={'4'}>{'1980s'}</option>, <option value={'5'}>{'1970s'}</option>, <option value={'6'}>{'1960s'}</option>, <option value={'7'}>{'1950s'}</option>
			, <option value={'8'}>{'1940s'}</option>, <option value={'9'}>{'1930s and before'}</option>],
			peas: [<option value={'1'}>{'Top 10'}</option>, <option value={'2'}>{'Top 50'}</option>, <option value={'3'}>{'Top 100'}</option>],

		  });

	}

	
	// handleChange(e) {
	// 	this.setState({
	// 		selectedAdvanced: e.target.value
	// 	});
	// }

	handleChange = (event) => {
		let value = event.target.value;
		let name = event.target.name;
	  
		

		if (name == 'selectedAco'){
			console.log("Update to aco");
			this.setState({
				selectedAco: value
			});
			this.selectedAco = value;
		} else if (name == 'selectedDan'){
			console.log("Update to dan");
			this.setState({
				selectedDan: value
			});
			this.selectedDan = value;

		} else if (name == 'selectedDur'){
			console.log("Update to dur");
			this.setState({
				selectedDur: value
			});
			this.selectedDur = value;
		} else if (name == 'selectedEne'){
			console.log("Update to ene");
			this.setState({
				selectedEne: value
			});
			this.selectedEne = value;
		} else if (name == 'selectedExp'){
			console.log("Update to exp");
			this.setState({
				selectedExp: value
			});
			this.selectedExp = value;
		} else if (name == 'selectedIns'){
			this.setState({
				selectedIns: value
			});
			this.selectedIns = value;
		} else if (name == 'selectedLiv'){
			this.setState({
				selectedLiv: value
			});
			this.selectedLiv = value;
		} else if (name == 'selectedLou'){
			this.setState({
				selectedLou: value
			});
			this.selectedLou = value;
		} else if (name == 'selectedMod'){
			this.setState({
				selectedMod: value
			});
			this.selectedMod = value;
		} else if (name == 'selectedMus'){
			this.setState({
				selectedMus: value
			});
			this.selectedMus = value;
		} else if (name == 'selectedPop'){
			this.setState({
				selectedPop: value
			});
			this.selectedPop = value;
		} else if (name == 'selectedSpe'){
			this.setState({
				selectedSpe: value
			});
			this.selectedSpe = value;
		} else if (name == 'selectedTem'){
			this.setState({
				selectedTem: value
			});
			this.selectedTem = value;
		} else if (name == 'selectedVal'){
			this.setState({
				selectedVal: value
			});
			this.selectedVal = value;
		} else if (name == 'selectedDec'){
			this.setState({
				selectedDec: value
			});
			this.selectedDec = value;
		} else if (name == 'selectedPea'){
			this.setState({
				selectedPea: value
			});
			this.selectedPea = value;
		}

		console.log(name, value)
	  }

	  // hit Submit
	submitAdvanced() {
		this.setState({
			songs: '',
		});

		if (this.selectedAco === undefined) this.selectedAco = 0;
		if (this.selectedDan === undefined) this.selectedDan = 0;
		if (this.selectedDur === undefined) this.selectedDur = 0;
		if (this.selectedEne === undefined) this.selectedEne = 0;
		if (this.selectedExp === undefined) this.selectedExp = 0;

		if (this.selectedIns === undefined) this.selectedIns = 0;
		if (this.selectedLiv === undefined) this.selectedLiv = 0;
		if (this.selectedLou === undefined) this.selectedLou = 0;
		if (this.selectedMod === undefined) this.selectedMod = 0;
		if (this.selectedMus === undefined) this.selectedMus = 12;

		if (this.selectedPop === undefined) this.selectedPop = 0;
		if (this.selectedSpe === undefined) this.selectedSpe = 0;
		if (this.selectedTem === undefined) this.selectedTem = 0;
		if (this.selectedVal === undefined) this.selectedVal = 0;
		if (this.selectedDec === undefined) this.selectedDec = 0;
		if (this.selectedPea === undefined) this.selectedPea = 0;


		
		// var fixed = this.state.selectedAdvanced.replace(/\//g,"-")
		var fixed = this.selectedAco + "/" + this.selectedDan + "/" + this.selectedDur + "/" + this.selectedEne + "/" + this.selectedExp
		+ "/" + this.selectedIns + "/" + this.selectedLiv + "/" + this.selectedLou + "/" + this.selectedMod + "/" + this.selectedMus
		+ "/" + this.selectedPop + "/" + this.selectedSpe + "/" + this.selectedTem + "/" + this.selectedVal + "/" + this.selectedDec + "/" + this.selectedPea
		
		// /advanced/:aco/:dan/:dur/:ene/:exp/:ins/:liv/:lou/:mod/:mus/:pop/:spe/:tem/:val

		console.log("http://localhost:8081/advanced/" + fixed);

		// fetch("http://localhost:8081/advanced/" + this.state.selectedAdvanced,
		fetch("http://localhost:8081/advanced/" + fixed,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(songList => {
			console.log(songList); //displays your JSON object in the console
			let songDivs = songList.map((song, i) => 

				<div id="results" key={i} className="results-container">
					{/* <PlaylistRow song_title={song.song_title} artist_name={song.artist_name} spotify_id={song.spotify_id}/> */}
					<AdvancedRow song_id={song.song_id} song_title={song.song_title} artist_name={song.artist_name} genre={song.genre} />
				</div>
				
			);

			
			this.setState({
				songs: songDivs,
			});
		});
	}

	render() {

		return (
			<div className="Advanced">
				<PageNavbar active="advanced" />

				<div className="container billboards-container">
				<center>
			      <div className="jumbotron">
				    <div className="h2">Advanced Search</div>
					<br></br>
			        <div className="h6">Discover new music with our <b>advanced search</b>.</div>
					<br></br>
			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedAco} onChange={this.handleChange} name = 'selectedAco' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Acousticness -- </option>
			            	{this.state.acos}
			            </select>
						<select value={this.state.selectedDan} onChange={this.handleChange} name = 'selectedDan' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Danceability -- </option>
			            	{this.state.dans}
			            </select>
						<select value={this.state.selectedDur} onChange={this.handleChange} name = 'selectedDur' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Duration -- </option>
			            	{this.state.durs}
			            </select>
						<select value={this.state.selectedEne} onChange={this.handleChange} name = 'selectedEne' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Energy -- </option>
			            	{this.state.enes}
			            </select>
						<select value={this.state.selectedExp} onChange={this.handleChange} name = 'selectedExp' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Explicit -- </option>
			            	{this.state.exps}
			            </select>

						<select value={this.state.selectedIns} onChange={this.handleChange} name = 'selectedIns' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Instrumentalness -- </option>
			            	{this.state.inss}
			            </select>
						<select value={this.state.selectedLiv} onChange={this.handleChange} name = 'selectedLiv' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Liveness -- </option>
			            	{this.state.livs}
			            </select>
						<select value={this.state.selectedLou} onChange={this.handleChange} name = 'selectedLou' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Loudness -- </option>
			            	{this.state.lous}
			            </select>
						<select value={this.state.selectedMod} onChange={this.handleChange} name = 'selectedMod' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Mode -- </option>
			            	{this.state.mods}
			            </select>
						<select value={this.state.selectedMus} onChange={this.handleChange} name = 'selectedMus' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Musical Key -- </option>
			            	{this.state.muss}
			            </select>
						

						<select value={this.state.selectedPop} onChange={this.handleChange} name = 'selectedPop' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Popularity -- </option>
			            	{this.state.pops}
			            </select>
						<select value={this.state.selectedSpe} onChange={this.handleChange} name = 'selectedSpe' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Speechiness -- </option>
			            	{this.state.spes}
			            </select>
						<select value={this.state.selectedTem} onChange={this.handleChange} name = 'selectedTem' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Tempo -- </option>
			            	{this.state.tems}
			            </select>
						<select value={this.state.selectedVal} onChange={this.handleChange} name = 'selectedVal' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Valence -- </option>
			            	{this.state.vals}
			            </select>
						<select value={this.state.selectedDec} onChange={this.handleChange} name = 'selectedDec' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Decade -- </option>
			            	{this.state.decs}
			            </select>
						<select value={this.state.selectedPea} onChange={this.handleChange} name = 'selectedPea' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- Peak Position -- </option>
			            	{this.state.peas}
			            </select>
						<br></br>
						<br></br>
			            <button className="button" id="advancedSubmitBtn" onClick={this.submitAdvanced}>Submit</button>
			          </div>
			        </div>
			      </div>
				</center>
				

			      <div className="jumbotron">
			        <div className="song-container">
			          <div className="song">
			            <div className="header"><strong>Song Title</strong></div>
						<div className="header"><strong>Artist Name</strong></div>
						{/* <div className="header"><strong>Spotify Link</strong></div> */}
						{/* <div className="header"><strong>Weeks On Chart</strong></div> */}
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