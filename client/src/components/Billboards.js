import React from 'react';
import PageNavbar from './PageNavbar';
import BillboardRow from './BillboardRow';
// import BillboardRowTest from './BillboardRowTest';
import '../style/Billboards.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Billboards extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedBillboard: "",
			selectedYear: "",
			selectedMonth: "",
			selectedDay: "",
			years: [],
			months: [],
			days: [],
			billboards: [],
			songs: []
			// , songsTest: []
		};

		this.submitBillboard = this.submitBillboard.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	
	/* ---- Billboards ---- */
	componentDidMount() {
		// Send an HTTP request to the server.
		// fetch("http://localhost:8081/billboards",
		// {
		//   method: 'GET' // The type of HTTP request.
		// }).then(res => {
		//   // Convert the response data to a JSON.
      	// 	return res.json();
      
		// }, err => {
		//   // Print the error if there is one.
		//   console.log(err);
		// }).then(billboardList => {
		//   if (!billboardList) return;
		//   // Map each genreObj in genreList to an HTML element:
		//   // A button which triggers the showMovies function for each genre.
		//   let billboardDivs = billboardList.map((billboardObj, i) =>
		// //   <option value={billboardObj.billboard}>{billboardObj.billboard}</option> 
		//   <option value={billboardObj.week_id}>{billboardObj.week_id}</option>  
		//   );
	
		  
	
		//   // Set the state of the genres list to the value returned by the HTTP response from the server.
		//   this.setState({
        // 	billboards: billboardDivs
		//   });
		// }, err => {
		//   // Print the error if there is one.
		//   console.log(err);
		// });

		fetch("http://localhost:8081/billboardsy/",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
      		return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(yearList => {
		  if (!yearList) return;
		  // Map each yearObj in genreList to an HTML element:
		  let yearDivs = yearList.map((yearObj, i) =>
		 	 <option value={yearObj.year}>{yearObj.year}</option>  
		  );
		  // Set the state of the years list to the value returned by the HTTP response from the server.
		  this.setState({
        	years: yearDivs
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});

		fetch("http://localhost:8081/billboardsm/",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
      		return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(monthList => {
		  if (!monthList) return;
		  // Map each monthObj in genreList to an HTML element:
		  let monthDivs = monthList.map((monthObj, i) =>
		 	 <option value={monthObj.month}>{monthObj.month}</option>  
		  );
		  // Set the state of the months list to the value returned by the HTTP response from the server.
		  this.setState({
        	months: monthDivs
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});

		console.log("http://localhost:8081/billboardsd/" + this.selectedYear + "/" + this.selectedMonth)

		fetch("http://localhost:8081/billboardsd/" + this.selectedYear + "/" + this.selectedMonth,
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
      		return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(dayList => {
		  if (!dayList) return;
		  // Map each dayObj in genreList to an HTML element:
		  let dayDivs = dayList.map((dayObj, i) =>
		 	 <option value={dayObj.day}>{dayObj.day}</option>  
		  );
		  // Set the state of the days list to the value returned by the HTTP response from the server.
		  this.setState({
        	days: dayDivs
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});
	}

	
	// handleChange(e) {
	// 	this.setState({
	// 		selectedBillboard: e.target.value
	// 	});
	// }

	handleChange = (event) => {
		let value = event.target.value;
		let name = event.target.name;
	  
		// this.setState({
		// 	[name]: value
		// });

		if (name == 'selectedYear'){
			console.log("Update to year");
			this.setState({
				selectedYear: value
			});
			this.selectedYear = value;
		} else if (name == 'selectedMonth'){
			console.log("Update to month");
			this.setState({
				selectedMonth: value
			});
			this.selectedMonth = value;

		} else if (name == 'selectedDay'){
			console.log("Update to day");
			this.setState({
				selectedDay: value
			});
			this.selectedDay = value;
		}

		console.log(name, value)
		console.log("selectedYear is " + this.selectedYear)
		console.log("selectedMonth is " + this.selectedMonth)


		// update options for Day

		console.log("http://localhost:8081/billboardsd/" + this.selectedYear + "/" + this.selectedMonth)

		fetch("http://localhost:8081/billboardsd/" + this.selectedYear + "/" + this.selectedMonth,
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
      		return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(dayList => {
		  if (!dayList) return;
		  // Map each dayObj in genreList to an HTML element:
		  let dayDivs = dayList.map((dayObj, i) =>
		 	 <option value={dayObj.day}>{dayObj.day}</option>  
		  );
		  // Set the state of the days list to the value returned by the HTTP response from the server.
		  this.setState({
        	days: dayDivs
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});
	  }

	  // hit Submit
	submitBillboard() {
		// var fixed = this.state.selectedBillboard.replace(/\//g,"-")
		var fixed = this.selectedMonth + "-" + this.selectedDay + "-" + this.selectedYear

		console.log("http://localhost:8081/billboards/" + fixed);

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

			// //test
			// let songDivsTest = songList.map((song, i) => 
			// 	// <RecommendationsRow key={recommendation.id} movie={recommendation} />
			// 	<div id="results" key={i} className="results-container">
			// 		<BillboardRowTest song_title={song.song_title} artist_name={song.artist_name} week_position={song.week_position} peak_position={song.peak_position} weeks_on_chart={song.weeks_on_chart}
			// 		release_date={song.release_date} release_year={song.release_year} acousticness={song.acousticness} danceability={song.danceability} 
			// 		duration_ms={song.duration_ms} energy={song.energy} explicit={song.explicit} instrumentalness={song.instrumentalness} musical_key={song.musical_key}
			// 		liveness={song.liveness} loudness={song.loudness} mode={song.mode} popularity={song.popularity} speechiness={song.speechiness} 
			// 		tempo={song.tempo} valence={song.valence} genre={song.genre}/>
			// 	</div>
				
			// );

			this.setState({
				songs: songDivs,
				//test
				// songsTest: songDivsTest

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
			            <select value={this.state.selectedYear} onChange={this.handleChange} name = 'selectedYear' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- select a year -- </option>
			            	{this.state.years}
			            </select>
						<select value={this.state.selectedMonth} onChange={this.handleChange} name = 'selectedMonth' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- select a month -- </option>
			            	{this.state.months}
			            </select>
						<select value={this.state.selectedDay} onChange={this.handleChange} name = 'selectedDay' className="dropdown" id="billboardsDropdown">
			            	<option select value> -- select a day -- </option>
			            	{this.state.days}
			            </select>
			            <button className="submit-btn" id="billboardsSubmitBtn" onClick={this.submitBillboard}>Submit</button>
			          </div>
			        </div>
			      </div>

					{/* test */}
				  {/* <table className= 'table-container'>
					  <tr>
						<th>Week Position</th>
						<th>Song Title</th>
						<th>Artist Name</th>
					  </tr>
					  {this.state.songsTest}
			  	  </table> */}

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