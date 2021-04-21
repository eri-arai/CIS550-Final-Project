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
    SELECT wc.week_id
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


// Get all billboard years for the dropdown options
function getBillboardChartYear(req, res) {
  console.log("inputYear");

  var query = `
    SELECT DISTINCT(YEAR(STR_TO_DATE(wc.week_id, '%m/%d/%Y'))) AS year
    FROM weekly_chart wc
    ORDER BY YEAR(STR_TO_DATE(wc.week_id, '%m/%d/%Y')) DESC;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get all billboard months for the dropdown options
function getBillboardChartMonth(req, res) {
  console.log("inputMonth");

  var query = `
    SELECT DISTINCT(MONTH(STR_TO_DATE(wc.week_id, '%m/%d/%Y'))) AS month
    FROM weekly_chart wc
    ORDER BY MONTH(STR_TO_DATE(wc.week_id, '%m/%d/%Y'));
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get all billboard days for the dropdown options
function getBillboardChartDay(req, res) {
  var inputYear = req.params.year;
  var inputMonth = req.params.month;
  console.log("inputDay");

  var query = `
    SELECT DISTINCT(DAYOFMONTH(STR_TO_DATE(wc.week_id, '%m/%d/%Y'))) AS day
    FROM weekly_chart wc
    WHERE YEAR(STR_TO_DATE(wc.week_id, '%m/%d/%Y')) =  '${inputYear}' AND MONTH(STR_TO_DATE(wc.week_id, '%m/%d/%Y')) = '${inputMonth}'
    ORDER BY DAYOFMONTH(STR_TO_DATE(wc.week_id, '%m/%d/%Y'));
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
    WHERE e.week_id =  '${inputWeek}'
    ORDER BY e.week_position;
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
  console.log("exact ", inputName);
  var query = `
    SELECT *
    FROM song s JOIN played_by pb ON s.song_id = pb.song_id
    JOIN musical_characteristics mc ON s.song_id = mc.song_id
    JOIN artist a ON a.artist_name = pb.artist_name
    WHERE s.song_title LIKE '${inputName}%'
    ORDER BY LENGTH(s.song_title), s.song_id
    LIMIT 20;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getSongsByVagueTitle(req, res) {
  var inputName = req.params.name;
  console.log("vague ",  inputName);
  var query = `
    SELECT *
    FROM song s JOIN played_by pb ON s.song_id = pb.song_id
    JOIN musical_characteristics mc ON s.song_id = mc.song_id
    JOIN artist a ON a.artist_name = pb.artist_name
    WHERE s.song_title LIKE '%${inputName}%'
    ORDER BY LENGTH(s.song_title), s.song_id
    LIMIT 20;
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
  // var query = `
  //   SELECT *
  //   FROM artist a
  //   WHERE a.artist_name LIKE '%${inputName}%'
  //   ORDER BY LENGTH(a.artist_name), a.artist_name;
  // `;
  var query = `
  SELECT a.artist_name, a.genre, COUNT(*) AS songs_in_database, TRUNCATE(AVG(acousticness),4) AS acousticness, TRUNCATE(AVG(danceability),4) AS danceability, 
  TRUNCATE(AVG(duration_ms),4) AS duration_ms, TRUNCATE(AVG(energy),4) AS energy, TRUNCATE(AVG(instrumentalness),4) AS instrumentalness, 
  TRUNCATE(AVG(liveness),4) AS liveness, TRUNCATE(AVG(loudness),4) AS loudness, TRUNCATE(AVG(popularity),4) AS popularity, TRUNCATE(AVG(speechiness),4) AS speechiness,
  TRUNCATE(AVG(tempo),4) AS tempo, TRUNCATE(AVG(valence),4) AS valence, MIN(NULLIF(s.peak_position, 0)) AS peak_position, MAX(s.weeks_on_chart) AS weeks_on_chart
   FROM artist a
   JOIN played_by pb ON a.artist_name = pb.artist_name 
   JOIN song s ON pb.song_id = s.song_id
   JOIN musical_characteristics mc ON s.song_id = mc.song_id 
   WHERE a.artist_name LIKE '%${inputName}%'
   GROUP BY a.artist_name 
   ORDER BY songs_in_database DESC
  ;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getArtistTopSongsByName(req, res) {
  var inputName = req.params.name;
  console.log("in getArtistTopSongs ", inputName);
  var query = `
  SELECT a.artist_name, s.song_title, s.weeks_on_chart, s.peak_position, mc.popularity 
    FROM artist a
    JOIN played_by pb ON a.artist_name = pb.artist_name 
    JOIN song s ON pb.song_id = s.song_id
    JOIN musical_characteristics mc ON s.song_id = mc.song_id 
    WHERE a.artist_name = '${inputName}'
    ORDER BY s.weeks_on_chart DESC, NULLIF(s.peak_position, 0), mc.popularity DESC
    LIMIT 10
   ;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      // console.log(rows)
      res.json(rows);
    }
  });
};


// Get all genres
function getAllGenres(req, res) {
  // var inputGenre = req.params.genre;
  // console.log("in getArtistTopSongs ", inputGenre);
  var query = `
  SELECT DISTINCT a.genre
    FROM artist a
   ;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      // console.log(rows)
      res.json(rows);
    }
  });
};

function getGenreByName(req, res) {
  // console.log(req);
  var inputGenre = req.params.genre;
  console.log(inputGenre);
  var query = `
  SELECT a.artist_name, a.genre, COUNT(*) AS songs_in_database, TRUNCATE(AVG(acousticness),4) AS acousticness, TRUNCATE(AVG(danceability),4) AS danceability, 
  TRUNCATE(AVG(duration_ms),4) AS duration_ms, TRUNCATE(AVG(energy),4) AS energy, TRUNCATE(AVG(instrumentalness),4) AS instrumentalness, 
  TRUNCATE(AVG(liveness),4) AS liveness, TRUNCATE(AVG(loudness),4) AS loudness, TRUNCATE(AVG(popularity),4) AS popularity, TRUNCATE(AVG(speechiness),4) AS speechiness,
  TRUNCATE(AVG(tempo),4) AS tempo, TRUNCATE(AVG(valence),4) AS valence, MIN(NULLIF(s.peak_position, 0)) AS peak_position, MAX(s.weeks_on_chart) AS weeks_on_chart
   FROM artist a
   JOIN played_by pb ON a.artist_name = pb.artist_name 
   JOIN song s ON pb.song_id = s.song_id
   JOIN musical_characteristics mc ON s.song_id = mc.song_id 
   WHERE a.genre LIKE '${inputGenre}%'
   GROUP BY a.genre 
   ORDER BY songs_in_database DESC
  ;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getGenreTopSongsByName(req, res) {
  var inputGenre = req.params.genre;
  console.log("in getGenreTopSongs ", inputGenre);
  var query = `
  SELECT a.artist_name, s.song_title, s.weeks_on_chart, s.peak_position, mc.popularity 
    FROM artist a
    JOIN played_by pb ON a.artist_name = pb.artist_name 
    JOIN song s ON pb.song_id = s.song_id
    JOIN musical_characteristics mc ON s.song_id = mc.song_id 
    WHERE a.genre = '${inputGenre}'
    ORDER BY s.weeks_on_chart DESC, NULLIF(s.peak_position, 0), mc.popularity DESC
    LIMIT 25
   ;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      // console.log(rows)
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
  if (inputValue == 'Uplifting'){
  query = `
    SELECT s.song_title, pb.artist_name, s.spotify_id 
    FROM musical_characteristics mc 
      JOIN song s ON mc.song_id = s.song_id 
      JOIN played_by pb ON s.song_id = pb.song_id
    WHERE s.release_year > 2015 AND mc.loudness > -30 
      AND mc.tempo > 70 AND mc.acousticness > 0.5 
      AND mc.mode = 'Major' AND mc.explicit = 'No'
    ORDER BY mc.popularity DESC
    LIMIT 20
    ;
  `;
  } else if (inputValue == 'Calming'){
  query = `
    SELECT song.song_title, 
    played_by.artist_name AS artist_name, song.spotify_id 
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.loudness < .7 AND m.tempo < 75 AND m.acousticness > .3 
    AND m.liveness < .7 AND m.explicit = 'No' AND m.popularity > 70
    AND song.release_year > 2015
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
  `;
  } else if (inputValue == 'Energetic'){
  query = `
    SELECT song.song_title, 
    played_by.artist_name AS artist_name, song.spotify_id 
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.energy > .7 AND m.tempo > 60 AND m.popularity > 70 AND song.release_year > 2015
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
  `;
  } else if (inputValue == 'Gloomy') {
    query = `
    SELECT song.song_title, 
    played_by.artist_name AS artist_name, song.spotify_id 
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.energy < .6 AND m.tempo < 60 AND m.danceability < .6 AND m.popularity > 70 AND song.release_year > 2015
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
  `;
  }
  else if (inputValue == 'Acoustic') {
    query = `
    SELECT song.song_title, 
    played_by.artist_name AS artist_name, song.spotify_id 
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.acousticness > .5 AND m.popularity > 70 AND song.release_year > 2015
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
  `;
  }
  else if (inputValue == 'Dancing') {
    query = `
      SELECT song.song_title, 
      played_by.artist_name AS artist_name, song.spotify_id 
      FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
      JOIN played_by ON played_by.song_id = m.Song_id
      WHERE m.energy > .7 AND m.tempo > 60 AND m.danceability > .6 AND m.popularity > 70 AND song.release_year > 2015
      GROUP BY song.song_title
      ORDER BY m.popularity DESC
      LIMIT 20;
    `;
  }
  else if (inputValue == 'Happy') {
    query = `
    SELECT song.song_title, played_by.artist_name AS artist_name, song.spotify_id 
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.explicit = "No" AND m.popularity > 70 AND m.musical_key ="A" AND m.mode = "Major" AND song.release_year > 2015
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
    `;
  }
  else if (inputValue == 'From the Stage') {
    query = `
    SELECT song.song_title, played_by.artist_name AS artist_name, song.spotify_id 
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.popularity > 70 AND m.liveness > .7 AND song.song_title NOT LIKE "%Christmas%"
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
    `;
  }
  else if (inputValue == 'Spoken Word') {
    query = `
    SELECT song.song_title, played_by.artist_name AS artist_name, song.spotify_id 
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.popularity > 50 AND m.speechiness > .7
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
    `;
  }
  else if (inputValue == 'Anxious') {
    query = `
    SELECT song.song_title, played_by.artist_name AS artist_name, song.spotify_id 
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.popularity > 70 AND m.mode = "Minor" AND m.musical_key = "D#"
    GROUP BY song.song_id
    ORDER BY m.popularity DESC
    LIMIT 20;
    `;
  }
  else if (inputValue == 'Work Out') {
    query = `
    SELECT song.song_title, 
    played_by.artist_name AS artist_name, song.spotify_id 
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.energy > .8 AND m.tempo > 90 AND m.popularity > 70 AND song.release_year > 2015 AND artist_name != "Pinkfong"
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
    `;
  }
  else {
   query = `
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = N'musical_characteristics';
  `;
  }
connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


// Advanced search
function advancedSearch(req, res) {
  var query = '';
  var whereStatement = '';
  
  var aco = req.params.aco;
  var dan = req.params.dan;
  var dur = req.params.dur;
  var ene = req.params.ene;
  var exp = req.params.exp;
  var ins = req.params.ins;
  var mus = req.params.mus;
  var liv = req.params.liv;
  var lou = req.params.lou;
  var mod = req.params.mod;
  var pop = req.params.pop;
  var spe = req.params.spe;
  var tem = req.params.tem;
  var val = req.params.val;
  var term = 'WHERE ';

  console.log(aco, dan, dur, ene, exp)

  if (aco == 1){
    whereStatement = whereStatement.concat(term, 'mc.acousticness > 0.5');
    term = ' AND ';
  } else if (aco == 2){
    whereStatement = whereStatement.concat(term, 'mc.acousticness < 0.5');
    term = ' AND ';
  }

  if (dan == 1){
    whereStatement = whereStatement.concat(term, 'mc.danceability > 0.5');
    term = ' AND ';
  } else if (dan == 2){
    whereStatement = whereStatement.concat(term, 'mc.danceability < 0.5');
    term = ' AND ';
  }

  if (dur == 1){
    whereStatement = whereStatement.concat(term, 'mc.duration_ms > 200000');
    term = ' AND ';
  } else if (dur == 2){
    whereStatement = whereStatement.concat(term, 'mc.duration_ms < 200000');
    term = ' AND ';
  }

  if (ene == 1){
    whereStatement = whereStatement.concat(term, 'mc.energy > 0.5');
    term = ' AND ';
  } else if (ene == 2){
    whereStatement = whereStatement.concat(term, 'mc.energy < 0.5');
    term = ' AND ';
  }

  if (exp == 1){
    whereStatement = whereStatement.concat(term, 'mc.explicit = \"No\"');
    term = ' AND ';
  } else if (exp == 2){
    whereStatement = whereStatement.concat(term, 'mc.explicit = \"Yes\"');
    term = ' AND ';
  }

  if (ins == 1){
    whereStatement = whereStatement.concat(term, 'mc.instrumentalness > 0.001');
    term = ' AND ';
  } else if (ins == 2){
    whereStatement = whereStatement.concat(term, 'mc.instrumentalness < 0.001');
    term = ' AND ';
  }


  var musical_key = '';

  // console.log("mus = ", mus)
  if (mus < 12) {
    switch(mus){
      case '0':
        musical_key = '\'C\''
        break;
      case '1':
        musical_key = '\'C#\''
        break;
      case '2':
        musical_key = '\'D\''
        break;
      case '3':
        musical_key = '\'D#\''
        break;
      case '4':
        musical_key = '\'E\''
        break;
      case '5':
        musical_key = '\'F\''
        break;
      case '6':
        musical_key = '\'F#\''
        break;
      case '7':
        musical_key = '\'G\''
        break;
      case '8':
        musical_key = '\'G#\''
        break;
      case '9':
        musical_key = '\'A\''
        break;
      case '10':
        musical_key = '\'A#\''
        break;
      case '11':
        musical_key = '\'B\''
        break;
      default:
        break;
    }
    // console.log("musical_key = ", musical_key)
    whereStatement = whereStatement.concat(term, 'mc.musical_key = ', musical_key);
    term = ' AND ';
  }

  if (liv == 1){
    whereStatement = whereStatement.concat(term, 'mc.liveness > 0.2');
    term = ' AND ';
  } else if (liv == 2){
    whereStatement = whereStatement.concat(term, 'mc.liveness < 0.2');
    term = ' AND ';
  }

  if (lou == 1){
    whereStatement = whereStatement.concat(term, 'mc.loudness > -10');
    term = ' AND ';
  } else if (lou == 2){
    whereStatement = whereStatement.concat(term, 'mc.loudness < -10');
    term = ' AND ';
  }

  if (mod == 1){
    whereStatement = whereStatement.concat(term, 'mc.mode = \"Minor\"');
    term = ' AND ';
  } else if (mod == 2){
    whereStatement = whereStatement.concat(term, 'mc.mode = \"Major\"');
    term = ' AND ';
  }

  if (pop == 1){
    whereStatement = whereStatement.concat(term, 'mc.popularity > 25');
    term = ' AND ';
  } else if (pop == 2){
    whereStatement = whereStatement.concat(term, 'mc.popularity < 25');
    term = ' AND ';
  }

  if (spe == 1){
    whereStatement = whereStatement.concat(term, 'mc.speechiness > 0.1');
    term = ' AND ';
  } else if (spe == 2){
    whereStatement = whereStatement.concat(term, 'mc.speechiness < 0.1');
    term = ' AND ';
  }

  if (tem == 1){
    whereStatement = whereStatement.concat(term, 'mc.tempo > 115');
    term = ' AND ';
  } else if (tem == 2){
    whereStatement = whereStatement.concat(term, 'mc.tempo < 115');
    term = ' AND ';
  }

  if (val == 1){
    whereStatement = whereStatement.concat(term, 'mc.valence > 0.5');
    term = ' AND ';
  } else if (val == 2){
    whereStatement = whereStatement.concat(term, 'mc.valence < 0.5');
    term = ' AND ';
  }

  console.log("whereStatement: ", whereStatement);

  query = `
    SELECT s.song_title, pb.artist_name AS artist_name, s.spotify_id 
    FROM song s
    JOIN played_by pb ON s.song_id = pb.song_id
    JOIN musical_characteristics mc ON s.song_id = mc.song_id
    ${whereStatement}
    GROUP BY s.spotify_id
    ORDER BY mc.popularity DESC
    LIMIT 25
    ;
  `;

  console.log("query: ", query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      // console.log("rows: ", rows);
      res.json(rows);
    }
  });
};
  
  
// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllBillboards: getAllBillboards,
  getBillboardChartByWeek: getBillboardChartByWeek,
  getBillboardChartYear: getBillboardChartYear,
  getBillboardChartMonth: getBillboardChartMonth,
  getBillboardChartDay: getBillboardChartDay,
  getAllSongs: getAllSongs,
  getSongsByTitle: getSongsByTitle,
  getSongsByVagueTitle:getSongsByVagueTitle,
  getAllArtists: getAllArtists,
  getArtistByName: getArtistByName,
  getArtistTopSongsByName: getArtistTopSongsByName,
  getAllGenres: getAllGenres,
  getGenreByName: getGenreByName,
  getGenreTopSongsByName: getGenreTopSongsByName,
  getAllCharacteristics: getAllCharacteristics,
  getCharacteristic: getCharacteristic,
  advancedSearch: advancedSearch

};