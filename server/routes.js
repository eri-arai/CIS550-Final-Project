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
    SELECT DISTINCT YEAR(STR_TO_DATE(wc.week_id, '%m/%d/%Y')) AS year
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

// Get all billboard years for the dropdown options
function getBillboardChartMonth(req, res) {
  console.log("inputMonth");

  var query = `
    SELECT DISTINCT MONTH(STR_TO_DATE(wc.week_id, '%m/%d/%Y')) AS month
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

// Get all billboard years for the dropdown options
function getBillboardChartDay(req, res) {
  var inputYear = req.params.year;
  var inputMonth = req.params.month;
  console.log("inputDay");

  var query = `
    SELECT DISTINCT DAYOFMONTH(STR_TO_DATE(wc.week_id, '%m/%d/%Y')) AS day
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
  console.log(inputName);
  var query = `
    SELECT *
    FROM song s JOIN played_by pb ON s.song_id = pb.song_id
    JOIN musical_characteristics mc ON s.song_id = mc.song_id
    WHERE s.song_title LIKE '%${inputName}%'
    ORDER BY LENGTH(s.song_title), s.song_id;
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
  SELECT a.artist_name, a.genre, COUNT(*) AS songs_in_database, AVG(acousticness) AS acousticness, AVG(danceability) AS danceability, 
  AVG(duration_ms) AS duration_ms, AVG(energy) AS energy, AVG(instrumentalness) AS instrumentalness, 
  AVG(liveness) AS liveness, AVG(loudness) AS loudness, AVG(popularity) AS popularity, AVG(speechiness) AS speechiness,
  AVG(tempo) AS tempo, AVG(valence) AS valence, MIN(NULLIF(s.peak_position, 0)) AS peak_position, MAX(s.weeks_on_chart) AS weeks_on_chart
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
      // console.log(rows);
      console.log(rows.length);
      // console.log(JSON.stringify(rows))
      // console.log(JSON.parse(JSON.stringify(rows)))


      res.json(rows);

      for(i = 0; i < rows.length; i++){
        
        console.log("Here comes row ", i);

        console.log(rows[i].artist_name);
        artistName = rows[i].artist_name

        getArtistTopSongs(artistName, function(rows2){
          // if (err2) console.log("err2", err2);
          // else{
            console.log(rows2)

          // }

        });
      }
    }
  });
};

function getArtistTopSongs(inputName, callback) {
  // var inputName = req.params.name;
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
      callback(rows);
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
    SELECT s.song_title, pb.artist_name
    FROM musical_characteristics mc 
      JOIN song s ON mc.song_id = s.song_id 
      JOIN played_by pb ON s.song_id = pb.song_id
    WHERE s.release_year > 2015 AND mc.loudness > -30 
      AND mc.tempo > 70 AND mc.acousticness > 0.5 
      AND mc.mode = 'Major' AND mc.explicit = 'No'
    ORDER BY mc.popularity DESC
    ;
  `;
  } else if (inputValue == 'Calming'){
  query = `
    SELECT DISTINCT song.song_title, 
    played_by.artist_name AS artist_name
    FROM song JOIN musical_characteristics m ON m.Spotify_id = song.spotify_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.loudness < .7 AND m.tempo < 75 AND m.acousticness > .3 
    AND m.liveness < .7 AND m.explicit = 'No' AND m.popularity > 70
    AND song.release_year > 2015
    GROUP BY song.song_title;
  `;
  } else if (inputValue == 'Energetic'){
  query = `
    SELECT DISTINCT song.song_title, 
    played_by.artist_name AS artist_name
    FROM song JOIN musical_characteristics m ON m.Spotify_id = song.spotify_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.energy > .7 AND m.tempo > 60 AND m.popularity > 70 AND song.release_year > 2015
    GROUP BY song.song_title;
  `;
  } else if (inputValue == 'Gloomy') {
    query = `
    SELECT DISTINCT song.song_title, 
    played_by.artist_name AS artist_name
    FROM song JOIN musical_characteristics m ON m.Spotify_id = song.spotify_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.energy < .6 AND m.tempo < 60 AND m.danceability < .6 AND m.popularity > 70 AND song.release_year > 2015
    GROUP BY song.song_title;
  `;
  }
  else if (inputValue == 'Acoustic') {
    query = `
    SELECT DISTINCT song.song_title, 
    played_by.artist_name AS artist_name
    FROM song JOIN musical_characteristics m ON m.Spotify_id = song.spotify_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.acousticness > .5 AND m.popularity > 70 AND song.release_year > 2015
    GROUP BY song.song_title;
  `;
  }
  else if (inputValue == 'Dancing') {
    query = `
      SELECT DISTINCT song.song_title, 
      played_by.artist_name AS artist_name
      FROM song JOIN musical_characteristics m ON m.Spotify_id = song.spotify_id
      JOIN played_by ON played_by.song_id = m.Song_id
      WHERE m.energy > .7 AND m.tempo > 60 AND m.danceability > .6 AND m.popularity > 70 AND song.release_year > 2015
      GROUP BY song.song_title;
    `;
  }
  else if (inputValue == 'Happy') {
    query = `
    SELECT DISTINCT song.song_title, played_by.artist_name AS artist_name
    FROM song JOIN musical_characteristics m ON m.Spotify_id = song.spotify_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.explicit = "No" AND m.popularity > 70 AND m.musical_key ="A" AND m.mode = "Major" AND song.release_year > 2015
    GROUP BY song.song_title
    LIMIT 20;
    `;
  }
  else if (inputValue == 'From the Stage') {
    query = `
    SELECT DISTINCT song.song_title, played_by.artist_name AS artist_name
    FROM song JOIN musical_characteristics m ON m.Spotify_id = song.spotify_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.popularity > 70 AND m.liveness > .7 AND song.song_title NOT LIKE "%Christmas%"
    GROUP BY song.song_title
    LIMIT 20;
    `;
  }
  else if (inputValue == 'Spoken Word') {
    query = `
    SELECT DISTINCT song.song_title, played_by.artist_name AS artist_name
    FROM song JOIN musical_characteristics m ON m.Spotify_id = song.spotify_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.popularity > 50 AND m.speechiness > .7
    GROUP BY song.song_title
    LIMIT 20;
    `;
  }
  else if (inputValue == 'Anxious') {
    query = `
    SELECT DISTINCT song.song_title, played_by.artist_name AS artist_name
    FROM song JOIN musical_characteristics m ON m.Spotify_id = song.spotify_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.popularity > 70 AND m.mode = "Minor" AND m.musical_key = "D#"
    GROUP BY song.song_id
    LIMIT 20;
    `;
  }
  else if (inputValue == 'Work Out') {
    query = `
    SELECT DISTINCT song.song_title, 
    played_by.artist_name AS artist_name
    FROM song JOIN musical_characteristics m ON m.Spotify_id = song.spotify_id
    JOIN played_by ON played_by.song_id = m.Song_id
    WHERE m.energy > .8 AND m.tempo > 90 AND m.popularity > 70 AND song.release_year > 2015 AND artist_name != "Pinkfong"
    GROUP BY song.song_title
    LIMIT 20;
    `;
  }
  // else if (inputValue == 'Work Out') {
  //   query = `
  //   SELECT song.song_title, 
  //   played_by.artist_name AS artist_name
  //   FROM song JOIN musical_characteristics m ON m.song_id = song.song_id
  //   JOIN played_by ON played_by.song_id = m.Song_id
  //   WHERE m.energy > .8 AND m.tempo > 90 AND m.popularity > 70 AND song.release_year > 2015 AND artist_name != "Pinkfong"
  //   GROUP BY song.song_id
  //   LIMIT 20;
  //   `;
  // }

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


  
  
// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllBillboards: getAllBillboards,
  getBillboardChartByWeek: getBillboardChartByWeek,
  getBillboardChartYear: getBillboardChartYear,
  getBillboardChartMonth: getBillboardChartMonth,
  getBillboardChartDay: getBillboardChartDay,
  getAllSongs: getAllSongs,
  getSongsByTitle: getSongsByTitle,
  getAllArtists: getAllArtists,
  getArtistByName: getArtistByName,
  getAllCharacteristics: getAllCharacteristics,
  getCharacteristic: getCharacteristic

};