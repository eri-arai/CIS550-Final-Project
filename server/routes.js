var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


// Get all billboards for the dropdown options
function getAllBillboards(req, res) {
  console.log("inputWeek");

  var query = `
    SELECT week_id
    FROM weekly_chart wc
    ORDER BY YEAR(STR_TO_DATE(wc.week_id, '%m/%d/%Y')) DESC, 
    MONTH(STR_TO_DATE(wc.week_id, '%m/%d/%Y')) DESC,
    DAYOFMONTH(STR_TO_DATE(wc.week_id, '%m/%d/%Y')) DESC    ;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get a specific billboard by week
function getBillboardChartByWeek(req, res) {
  var inputWeek = req.params.week;
  inputWeek = inputWeek.replace(/-/g,'/');
  console.log(inputWeek);


  var query = `
    SELECT *
    FROM entry e JOIN song s ON e.song_id = s.song_id
    JOIN played_by pb ON s.song_id = pb.song_id
    JOIN musical_characteristics mc ON s.song_id = mc.song_id
    JOIN artist a ON pb.artist_name = a.artist_name
    WHERE week_id =  '${inputWeek}'
    ORDER BY week_position;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get all songs. There is no use for this, it's just to test. Don't use it.
function getAllSongs(req, res) {
  var query = `
    SELECT DISTINCT song_title
    FROM song;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get a song by title
// Maybe change to LIKE instead of =
function getSongsByTitle(req, res) {
  var inputName = req.params.name;
  console.log(inputName);
  var query = `
    SELECT *
    FROM song s JOIN played_by pb ON s.song_id = pb.song_id
    JOIN musical_characteristics mc ON s.song_id = mc.song_id
    WHERE song_title = '${inputName}';
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get all artists. Again, only useful for testing stuff.
function getAllArtists(req, res) {
  var query = `
    SELECT DISTINCT artist_name
    FROM artist;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get artist by name
// Should probably change to LIKE intead of =
function getArtistByName(req, res) {
  var inputName = req.params.name;
  console.log(inputName);
  var query = `
    SELECT *
    FROM artist
    WHERE artist_name = '${inputName}';
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get all characteristics
function getAllCharacteristics(req, res) {
  var query = `
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = N'musical_characteristics'
    ;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get characteristics based on options, sort of the custom playlist thing. 
// Definitely needs a lot of work. This was just testing.
function getCharacteristic(req, res) {
  var query = '';
  
  var inputValue = req.params.characteristic;

  console.log(inputValue);
  if (inputValue == 'uplifting'){
    query = `
    SELECT *
    FROM musical_characteristics mc JOIN song s ON mc.song_id = s.song_id JOIN played_by pb ON s.song_id = pb.song_id
    WHERE release_year > 1970 AND loudness > -30 AND tempo > 70 AND acousticness > 0.5 AND speechiness > 0.5 AND mode =1 AND explicit < 0.5
    ;
  `;
  } else if (inputValue == 'calming'){
    query = `
    SELECT *
    FROM musical_characteristics mc JOIN song s ON mc.song_id = s.song_id JOIN played_by pb ON s.song_id = pb.song_id
    WHERE release_year > 1970 AND loudness < -30 AND tempo < 70 AND acousticness > 0.7 AND speechiness < 0.5 AND mode > 0.5 AND liveness < 0.3 AND explicit < 0.5
    ;
  `;
  } else if (inputValue == 'highenergy'){
    query = `
    SELECT *
    FROM musical_characteristics mc JOIN song s ON mc.song_id = s.song_id JOIN played_by pb ON s.song_id = pb.song_id
    WHERE release_year > 1970 AND loudness > -30 AND tempo > 100 AND speechiness > 0.5 AND liveness >  0.5 AND danceability > 0.5 AND explicit > 0.5
    ;
  `;
  } else {
    query = `
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = N'musical_characteristics'
    ;
  `;
  }
  
  
  
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllBillboards: getAllBillboards,
  getBillboardChartByWeek: getBillboardChartByWeek,
  getAllSongs: getAllSongs,
  getSongsByTitle: getSongsByTitle,
  getAllArtists: getAllArtists,
  getArtistByName: getArtistByName,
  getAllCharacteristics: getAllCharacteristics,
  getCharacteristic: getCharacteristic


}