import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { slideDown, slideUp } from './Collapse';
import InnerRow from './InnerRow';



export default class AdvancedRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			songID: this.props.song_id,
			recBillboardInner: []
		}
	}
	
	state = { expanded: false }
  
	// test
	submitBillboardInner() {

		this.state.songID = this.state.songID.replace(/\//g,"-----")

		console.log("http://localhost:8081/billboardss/" + this.state.songID);
		fetch("http://localhost:8081/billboardss/" + this.state.songID,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(billboardList => {
			console.log("billboardList in BillboardRow",billboardList); //displays your JSON object in the console

			let billboardDivs = billboardList.map((song, i) => 
				<div id="results" key={i} className="results-container">
					<InnerRow song_title={song.song_title} artist_name={song.artist_name} week_position={song.week_position} peak_position={song.peak_position} weeks_on_chart={song.weeks_on_chart}
						release_date={song.release_date} release_year={song.release_year} acousticness={song.acousticness} danceability={song.danceability} 
						duration_ms={song.duration_ms} energy={song.energy} explicit={song.explicit} instrumentalness={song.instrumentalness} musical_key={song.musical_key}
						liveness={song.liveness} loudness={song.loudness} mode={song.mode} popularity={song.popularity} speechiness={song.speechiness} 
						tempo={song.tempo} valence={song.valence} genre={this.props.genre} spotify_id = {song.spotify_id}/>
				</div>
				
			);

			this.setState({
				recBillboardInner: billboardDivs
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
			  this.submitBillboardInner();
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

		// var genre, release_date, release_year = '';
		// if (this.props.genre == ''){
		// 	genre = 'Unknown'
		// } else {
		// 	genre = this.props.genre;
		// }
		// if (this.props.release_date == ''){
		// 	release_date = 'Unknown'
		// } else {
		// 	release_date = this.props.release_date;
		// }
		// if (this.props.release_year == 0){
		// 	release_year = 'Unknown'
		// } else {
		// 	release_year = this.props.release_year;
		// }

		
		// var spotify_link = "https://open.spotify.com/track/" + this.props.spotify_id;
		return [
			
			<tr key="main" onClick={this.toggleExpander}>
				<div className="songResults">
					<div className="data">{this.props.song_title}</div>
					<div className="data">{this.props.artist_name}</div>
					{/* <div className="data"><a href={spotify_link} target="_blank">Find it on Spotify</a></div> */}
				</div>
			</tr>,
			this.state.expanded && (
				<tr className="expandable" key="tr-expander">
					<td className="uk-background-muted" colSpan={6}>
						<div ref="expanderBody" className="inner uk-grid">
							<div className="uk-width-3-4">
								<div className="results-container" id="results">
									{this.state.recBillboardInner}
								</div>
							</div>
						</div>
					</td>
				</tr>
			)
		];
	}
  }
