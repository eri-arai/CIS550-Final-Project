var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


// Get all billboards for the dropdown options
// No longer used
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
// No longer used
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
    SELECT s.song_id, s.song_title, a.artist_name, a.genre, e.week_position
    FROM entry e JOIN song s ON e.song_id = s.song_id
    JOIN played_by pb ON s.song_id = pb.song_id
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

// Get a specific billboard url
function getBillboardURL(req, res) {
  var inputWeek = req.params.week;
  inputWeek = inputWeek.replace(/-/g,'/');

  var query = `
    SELECT wc.url
    FROM weekly_chart wc 
    WHERE wc.week_id =  '${inputWeek}'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get a song by song_id for billboard
function getBillboardChartByWeekAndSong(req, res) {
  var inputSong = req.params.song;
  inputSong = inputSong.replace(/-----/g,'/'); // this is only relevant to a couple songs
  console.log("song_id ", inputSong);
  var query = `
    SELECT s.peak_position, s.weeks_on_chart, s.release_date, s.release_year,
    mc.acousticness, mc.danceability, mc.duration_ms, mc.energy,
    mc.explicit, mc.instrumentalness, mc.liveness, mc.loudness,
    mc.mode, mc.musical_key, mc.popularity, mc.speechiness, mc.tempo, 
    mc.valence, s.spotify_id
    FROM song s 
    JOIN musical_characteristics mc ON s.song_id = mc.song_id
    WHERE s.song_id = '${inputSong}';
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

// Get a song by title. Uses the index on song_title.
function getSongsByTitle(req, res) {
  var inputName = req.params.name;
  console.log("exact ", inputName);
  var query = `
    SELECT s.song_title, a.artist_name, s.peak_position, s.weeks_on_chart, s.release_date, s.release_year,
    mc.acousticness, mc.danceability, mc.duration_ms, mc.energy,
    mc.explicit, mc.instrumentalness, mc.liveness, mc.loudness,
    mc.mode, mc.musical_key, mc.popularity, mc.speechiness, mc.tempo, 
    mc.valence, s.spotify_id, a.genre    
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

// This search won't use the index on song_title, so it is only used if getSongsByTitle() does not return any matches
function getSongsByVagueTitle(req, res) {
  var inputName = req.params.name;
  console.log("vague ",  inputName);
  var query = `
    SELECT s.song_title, a.artist_name, s.peak_position, s.weeks_on_chart, s.release_date, s.release_year,
    mc.acousticness, mc.danceability, mc.duration_ms, mc.energy,
    mc.explicit, mc.instrumentalness, mc.liveness, mc.loudness,
    mc.mode, mc.musical_key, mc.popularity, mc.speechiness, mc.tempo, 
    mc.valence, s.spotify_id, a.genre 
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



// Get artist by name. 
function getArtistByName(req, res) {
  var inputName = req.params.name;
  console.log(inputName);
  
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

// Get top songs by an artist
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


// Get all genres. Only used for testing.
function getAllGenres(req, res) {
  var query = `
  SELECT DISTINCT a.genre
    FROM artist a
   ;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Get averages for a genre
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

// Get top songs within a genre
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

// Get all characteristics. Only used for testing.
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

// Get playlist results  
function getCharacteristic(req, res) {
  var query = '';
  
  var inputValue = req.params.characteristic;

  console.log(inputValue);
  if (inputValue == 'Uplifting'){
  query = `
    SELECT s.song_title, pb.artist_name, s.spotify_id, s.song_id, a.genre 
    FROM musical_characteristics mc 
      JOIN song s ON mc.song_id = s.song_id 
      JOIN played_by pb ON s.song_id = pb.song_id
      JOIN artist a ON pb.artist_name = a.artist_name
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
    played_by.artist_name AS artist_name, song.spotify_id, song.song_id, a.genre 
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    JOIN artist a ON played_by.artist_name = a.artist_name
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
    played_by.artist_name AS artist_name, song.spotify_id, song.song_id, a.genre
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    JOIN artist a ON played_by.artist_name = a.artist_name
    WHERE m.energy > .7 AND m.tempo > 60 AND m.popularity > 70 AND song.release_year > 2015
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
  `;
  } else if (inputValue == 'Gloomy') {
    query = `
    SELECT song.song_title, 
    played_by.artist_name AS artist_name, song.spotify_id, song.song_id, a.genre
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    JOIN artist a ON played_by.artist_name = a.artist_name
    WHERE m.energy < .6 AND m.tempo < 90 AND m.danceability < .6 AND m.popularity > 70 AND song.release_year > 2015
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
  `;
  }
  else if (inputValue == 'Acoustic') {
    query = `
    SELECT song.song_title, 
    played_by.artist_name AS artist_name, song.spotify_id, song.song_id, a.genre
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    JOIN artist a ON played_by.artist_name = a.artist_name
    WHERE m.acousticness > .5 AND m.popularity > 70 AND song.release_year > 2015
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
  `;
  }
  else if (inputValue == 'Dancing') {
    query = `
      SELECT song.song_title, 
      played_by.artist_name AS artist_name, song.spotify_id, song.song_id, a.genre
      FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
      JOIN played_by ON played_by.song_id = m.Song_id
      JOIN artist a ON played_by.artist_name = a.artist_name
      WHERE m.energy > .7 AND m.tempo > 60 AND m.danceability > .6 AND m.popularity > 70 AND song.release_year > 2015
      GROUP BY song.song_title
      ORDER BY m.popularity DESC
      LIMIT 20;
    `;
  }
  else if (inputValue == 'Happy') {
    query = `
    SELECT song.song_title, played_by.artist_name AS artist_name, song.spotify_id, song.song_id, a.genre
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    JOIN artist a ON played_by.artist_name = a.artist_name
    WHERE m.explicit = "No" AND m.popularity > 70 AND m.musical_key ="A" AND m.mode = "Major" AND song.release_year > 2015
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
    `;
  }
  else if (inputValue == 'From the Stage') {
    query = `
    SELECT song.song_title, played_by.artist_name AS artist_name, song.spotify_id, song.song_id, a.genre
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    JOIN artist a ON played_by.artist_name = a.artist_name
    WHERE m.popularity > 70 AND m.liveness > .7 AND song.song_title NOT LIKE "%Christmas%"
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
    `;
  }
  else if (inputValue == 'Spoken Word') {
    query = `
    SELECT song.song_title, played_by.artist_name AS artist_name, song.spotify_id, song.song_id, a.genre
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    JOIN artist a ON played_by.artist_name = a.artist_name
    WHERE m.popularity > 50 AND m.speechiness > .7
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
    `;
  }
  else if (inputValue == 'Anxious') {
    query = `
    SELECT song.song_title, played_by.artist_name AS artist_name, song.spotify_id, song.song_id, a.genre
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    JOIN artist a ON played_by.artist_name = a.artist_name
    WHERE m.popularity > 70 AND m.mode = "Minor" AND m.musical_key = "D#"
    GROUP BY song.song_id
    ORDER BY m.popularity DESC
    LIMIT 20;
    `;
  }
  else if (inputValue == 'Work Out') {
    query = `
    SELECT song.song_title, played_by.artist_name AS artist_name, song.spotify_id, song.song_id, a.genre
    FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
    JOIN played_by ON played_by.song_id = m.Song_id
    JOIN artist a ON played_by.artist_name = a.artist_name
    WHERE m.energy > .8 AND m.tempo > 90 AND m.popularity > 70 AND song.release_year > 2015 AND played_by.artist_name != "Pinkfong"
    GROUP BY song.song_title
    ORDER BY m.popularity DESC
    LIMIT 20;
    `;
  }
  else {
   query = `
    SELECT s.song_title
    FROM song s
    WHERE s.song_id = ''
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


// Advanced search. Effectively creates a custom playlist based on user inputs.
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
  var dec = req.params.dec;
  var pea = req.params.pea;
  var term = 'WHERE ';

  if (aco == 1){
    whereStatement = whereStatement.concat(term, 'mc.acousticness > 0.66');
    term = ' AND ';
  } else if (aco == 2){
    whereStatement = whereStatement.concat(term, 'mc.acousticness >= 0.33 AND mc.acousticness <= 0.66');
    term = ' AND ';
  } else if (aco == 3){
    whereStatement = whereStatement.concat(term, 'mc.acousticness < 0.33');
    term = ' AND ';
  }

  if (dan == 1){
    whereStatement = whereStatement.concat(term, 'mc.danceability > 0.66');
    term = ' AND ';
  } else if (dan == 2){
    whereStatement = whereStatement.concat(term, 'mc.danceability >= 0.33 AND mc.danceability <= 0.66');
    term = ' AND ';
  } else if (dan == 3){
  whereStatement = whereStatement.concat(term, 'mc.danceability < 0.33');
  term = ' AND ';
  }

  if (dur == 1){
    // whereStatement = whereStatement.concat(term, 'mc.duration_ms > 133333');
    whereStatement = whereStatement.concat(term, 'mc.duration_ms > 333000');
    term = ' AND ';
  } else if (dur == 2){
    // whereStatement = whereStatement.concat(term, 'mc.duration_ms >= 66666 AND mc.duration_ms <= 133333');
    whereStatement = whereStatement.concat(term, 'mc.duration_ms >= 73500 AND mc.duration_ms <= 333000');
    term = ' AND ';
  } else if (dur == 3){
    // whereStatement = whereStatement.concat(term, 'mc.duration_ms < 66666');
    whereStatement = whereStatement.concat(term, 'mc.duration_ms < 73500');
    term = ' AND ';
  }

  if (ene == 1){
    whereStatement = whereStatement.concat(term, 'mc.energy > 0.66');
    term = ' AND ';
  } else if (ene == 2){
    whereStatement = whereStatement.concat(term, 'mc.energy >= 0.33 AND mc.energy <= 0.66');
    term = ' AND ';
  } else if (ene == 3){
    whereStatement = whereStatement.concat(term, 'mc.energy < 0.33');
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
    whereStatement = whereStatement.concat(term, 'mc.instrumentalness > 0.066');
    term = ' AND ';
  } else if (ins == 2){
    whereStatement = whereStatement.concat(term, 'mc.instrumentalness >= 0.033 AND mc.instrumentalness <=0.066');
    term = ' AND ';
  } else if (ins == 3){
    whereStatement = whereStatement.concat(term, 'mc.instrumentalness < 0.033');
    term = ' AND ';
  }

  var musical_key = '';

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
    whereStatement = whereStatement.concat(term, 'mc.musical_key = ', musical_key);
    term = ' AND ';
  }

  if (liv == 1){
    whereStatement = whereStatement.concat(term, 'mc.liveness > 0.2');
    term = ' AND ';
  } else if (liv == 2){
    whereStatement = whereStatement.concat(term, 'mc.liveness >= 0.05 AND mc.liveness <= 0.2');
    term = ' AND ';
  } else if (liv == 3){
    whereStatement = whereStatement.concat(term, 'mc.liveness < 0.05');
    term = ' AND ';
  }

  if (lou == 1){
    whereStatement = whereStatement.concat(term, 'mc.loudness > -7.5');
    term = ' AND ';
  } else if (lou == 2){
    whereStatement = whereStatement.concat(term, 'mc.loudness >= -15 AND mc.loudness <= -7.5');
    term = ' AND ';
  } else if (lou == 3){
    whereStatement = whereStatement.concat(term, 'mc.loudness < -15');
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
    whereStatement = whereStatement.concat(term, 'mc.popularity > 66');
    term = ' AND ';
  } else if (pop == 2){
    whereStatement = whereStatement.concat(term, 'mc.popularity >= 33 AND mc.popularity <= 66');
    term = ' AND ';
  } else if (pop == 3){
    whereStatement = whereStatement.concat(term, 'mc.popularity < 33');
    term = ' AND ';
  }

  if (spe == 1){
    whereStatement = whereStatement.concat(term, 'mc.speechiness > 0.066');
    term = ' AND ';
  } else if (spe == 2){
    whereStatement = whereStatement.concat(term, 'mc.speechiness >= 0.033 AND mc.speechiness <= 0.066');
    term = ' AND ';
  } else if (spe == 2){
    whereStatement = whereStatement.concat(term, 'mc.speechiness < 0.033');
    term = ' AND ';
  }

  if (tem == 1){
    whereStatement = whereStatement.concat(term, 'mc.tempo >= 200');
    term = ' AND ';
  } else if (tem == 2){
    whereStatement = whereStatement.concat(term, 'mc.tempo >= 168 AND mc.tempo <= 200');
    term = ' AND ';
  } else if (tem == 3){
    whereStatement = whereStatement.concat(term, 'mc.tempo >= 120 AND mc.tempo <= 168');
    term = ' AND ';
  } else if (tem == 4){
    whereStatement = whereStatement.concat(term, 'mc.tempo >= 108 AND mc.tempo <= 120');
    term = ' AND ';
  } else if (tem == 5){
    whereStatement = whereStatement.concat(term, 'mc.tempo >= 76 AND mc.tempo <= 108');
    term = ' AND ';
  } else if (tem == 6){
    whereStatement = whereStatement.concat(term, 'mc.tempo >= 60 AND mc.tempo <= 76');
    term = ' AND ';
  } else if (tem == 7){
    whereStatement = whereStatement.concat(term, 'mc.tempo >= 40 AND mc.tempo <= 60');
    term = ' AND ';
  } else if (tem == 8){
    whereStatement = whereStatement.concat(term, 'mc.tempo < 40');
    term = ' AND ';
  }

  if (val == 1){
    whereStatement = whereStatement.concat(term, 'mc.valence > 0.66');
    term = ' AND ';
  } else if (val == 2){
    whereStatement = whereStatement.concat(term, 'mc.valence >= 0.3 AND mc.valence <= 0.66');
    term = ' AND ';
  } else if (val == 3){
    whereStatement = whereStatement.concat(term, 'mc.valence < 0.3');
    term = ' AND ';
  }

  if (dec == 1){
    whereStatement = whereStatement.concat(term, 's.release_year >= 2010');
    term = ' AND ';
  } else if (dec == 2){
    whereStatement = whereStatement.concat(term, 's.release_year >= 2000 AND s.release_year < 2010');
    term = ' AND ';
  } else if (dec == 3){
    whereStatement = whereStatement.concat(term, 's.release_year >= 1990 AND s.release_year < 2000');
    term = ' AND ';
  } else if (dec == 4){
    whereStatement = whereStatement.concat(term, 's.release_year >= 1980 AND s.release_year < 1990');
    term = ' AND ';
  } else if (dec == 5){
    whereStatement = whereStatement.concat(term, 's.release_year >= 1970 AND s.release_year < 1980');
    term = ' AND ';
  } else if (dec == 6){
    whereStatement = whereStatement.concat(term, 's.release_year >= 1960 AND s.release_year < 1970');
    term = ' AND ';
  } else if (dec == 7){
    whereStatement = whereStatement.concat(term, 's.release_year >= 1950 AND s.release_year < 1960');
    term = ' AND ';
  } else if (dec == 8){
    whereStatement = whereStatement.concat(term, 's.release_year >= 1940 AND s.release_year < 1950');
    term = ' AND ';
  } else if (dec == 9){
    whereStatement = whereStatement.concat(term, 's.release_year < 1940');
    term = ' AND ';
  }

  if (pea == 1){
    whereStatement = whereStatement.concat(term, 's.peak_position > 0 AND s.peak_position <= 10');
    term = ' AND ';
  } else if (pea == 2){
    whereStatement = whereStatement.concat(term, 's.peak_position > 0 AND s.peak_position <= 50');
    term = ' AND ';
  } else if (pea == 3){
    whereStatement = whereStatement.concat(term, 's.peak_position > 0 AND s.peak_position <= 100');
    term = ' AND ';
  }

  console.log("whereStatement: ", whereStatement);

  
  query = `
    SELECT s.song_title, pb.artist_name AS artist_name, a.genre, s.song_id
    FROM song s
    JOIN played_by pb ON s.song_id = pb.song_id
    JOIN musical_characteristics mc ON s.song_id = mc.song_id
    JOIN artist a ON pb.artist_name = a.artist_name
    ${whereStatement}
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
  getBillboardChartByWeekAndSong: getBillboardChartByWeekAndSong,
  getBillboardChartYear: getBillboardChartYear,
  getBillboardChartMonth: getBillboardChartMonth,
  getBillboardChartDay: getBillboardChartDay,
  getBillboardURL: getBillboardURL,
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