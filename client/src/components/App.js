import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Billboards from './Billboards';
import Songs from './Songs';
import Artists from './Artists';
import Genres from './Genres';
import Playlist from './Playlist';



export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Billboards />
							)}
						/>

						<Route
							exact
							path="/billboards"
							render={() => (
								<Billboards />
							)}
						/>
						<Route
							exact
							path="/songs"
							render={() => (
								<Songs />
							)}
						/>
						<Route
							exact
							path="/artists"
							render={() => (
								<Artists />
							)}
						/>
						<Route
							exact
							path="/genres"
							render={() => (
								<Genres />
							)}
						/>
						<Route
							exact
							path="/playlist"
							render={() => (
								<Playlist/>
							)}
						/>
						
					</Switch>
				</Router>
			</div>
		);
	}
}