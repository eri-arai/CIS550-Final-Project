const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */




app.get('/billboards', routes.getAllBillboards);
app.get('/billboards/:week', routes.getBillboardChartByWeek);
app.get('/billboardsy/', routes.getBillboardChartYear);
app.get('/billboardsm/', routes.getBillboardChartMonth);
app.get('/billboardsd/:year/:month', routes.getBillboardChartDay);


app.get('/songs', routes.getAllSongs);
app.get('/songs/:name', routes.getSongsByTitle);

app.get('/artists', routes.getAllArtists);
app.get('/artists/:name', routes.getArtistByName);

app.get('/characteristics', routes.getAllCharacteristics);
app.get('/characteristics/:characteristic', routes.getCharacteristic);


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});