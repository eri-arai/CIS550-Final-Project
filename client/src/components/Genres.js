import React from 'react';
import PageNavbar from './PageNavbar';
import GenresRow from './GenresRow';
import '../style/Genres.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Genres extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected genre name,
		// and the list of recommended genres.
		this.state = {
			genreName: "",
			recGenres: []
		}

		this.handleGenreNameChange = this.handleGenreNameChange.bind(this);
		this.submitGenre = this.submitGenre.bind(this);
	}

	handleGenreNameChange(e) {
		this.setState({
			genreName: e.target.value
		});
	}

	submitGenre() {
		this.setState({
			recGenres: ''
		});
		console.log("http://localhost:8081/genres/" + this.state.genreName);
		

		if (this.state.genreName === undefined | this.state.genreName == ''){
			// this.genreName = '';
			console.log('Invalid');
		} else {
			fetch("http://localhost:8081/genres/" + this.state.genreName,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(genresList => {
				console.log(genresList); //displays your JSON object in the console

				let genresDivs = genresList.map((genre, i) => 
					// <RecommendationsRow key={recommendation.id} genre={recommendation} />
					<div id="results" key={i} className="results-container">
						{/* <GenresRow artist_name={genre.artist_name}/> */}
						<GenresRow song_title={genre.song_title} artist_name={genre.artist_name} week_position={genre.week_position} peak_position={genre.peak_position} weeks_on_chart={genre.weeks_on_chart}
						release_date={genre.release_date} release_year={genre.release_year} acousticness={genre.acousticness} danceability={genre.danceability} 
						duration_ms={genre.duration_ms} energy={genre.energy} explicit={genre.explicit} instrumentalness={genre.instrumentalness} musical_key={genre.musical_key}
						liveness={genre.liveness} loudness={genre.loudness} mode={genre.mode} popularity={genre.popularity} speechiness={genre.speechiness} 
						tempo={genre.tempo} valence={genre.valence} genre={genre.genre} songs_in_database={genre.songs_in_database}/>
					</div>
					
				);

				this.setState({
					recGenres: genresDivs
				});
			});
		}
	}

	
	render() {

		return (
			<div className="Genres">
				<PageNavbar active="genres" />

			    <div className="container genres-container">
			    	<div className="jumbotron">
			    		<div className="h5">Genres</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Genre Name" value={this.state.genreName} onChange={this.handleGenreNameChange} id="genreName" className="Genre-input"/>
			    			<button id="submitGenreBtn" className="submit-btn" onClick={this.submitGenre}>Submit</button>
			    		</div>
			    	</div>

					<div className="jumbotron">
						<div className="header-container">
							<div className="headers">
								{/* <div className="header"><strong>Artist Name</strong></div> */}
								<div className="header"><strong>Genre</strong></div>
								<div className="header"><strong>Songs in Database</strong></div>
							</div>
							<div className="genre-container" id="results">
								{this.state.recGenres}
							</div>
						</div>
			     	</div>
			    </div>
		    </div>
		);
	}
}

				