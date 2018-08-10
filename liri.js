// Loads .dotenv containing locally stored API keys
require("dotenv").config();

// Load the NPM Packages: request and fs
var request = require("request");
var fs = require("fs");

// Import our keys
var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);
// var weather = new request(keys.openweathermap);


// Takes in all of the command line arguments
var inputString = process.argv;

// Parses the command line argument to capture the user's command
var command = inputString[2];
var query = [];

for (var x = 3; x < inputString.length; x++) {
    query.push(inputString[x]);
}

console.log("calling query variable");
console.log(query);
console.log("");

switch (command) {
    case "spotify-this-song":
        spotifyThisSong(query);
        break;
    case "movie-this":
        movieThis(query);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    case "weather-this":
        weatherThis(query);
        break;
}

function spotifyThisSong(inputString) {
    console.log("==================================");
    console.log("Calling Spotify-This-Song Function");
    console.log("==================================\n");

    // Variable used to create and store the song name received from the user at terminal command line
    var song = "";

    // Variable array to store the results received back from the Node Spotify API Search
    var results = [];

    // Variable to store the query limit for the Node Spotify API Search
    var limit = 0;

    // Condition to check if user enters a song name or not
    // If the user does not, it will default to Ace of Base's "The Sign"
    // If the user did enter a song name, it will use the node spotify api search to query spotify's database for the top 5 results
    if (inputString.length === 0) {
        console.log("No song specified, defaulting Ace of Base's 'The Sign'\n");
        song = "Ace of Base The Sign";
        limit = 1;
    }
    else {
        limit = 5;

        // Capture all the words in the given song name (starts at 3 to ignore the first 2 process.argv values (node.js location + javascript file location) and the 3rd one(command sent to liri.js) )
        for (var x = 0; x < inputString.length; x++) {

            // Build a string with the song name
            // Condition check for loop starting at 3 to prevent extra blank space being added in front of the song name
            if (x === 0) {
                song = song + inputString[x];
            } else {
                song = song + " " + inputString[x];
            }
        }
    }

    // Console log below only shows if user actually types in a song to search for
    if (limit === 5) {
        console.log("You entered the following song name:  -" + song + "-");

    }

    // Using node spotify api search 
    spotify.search({ type: "track", query: song, limit: limit }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //Store the artist, song, preview link, and album in the results array
        data.tracks.items.forEach(function (entry) {
            results.push({
                artist: entry.artists[0].name,
                song: entry.name,
                preview: entry.external_urls.spotify,
                album: entry.album.name
            });
        });

        // Console log below only shows if user actually types in a song to search for
        if (limit === 5) {
            console.log("\nShowing top 5 search results for '" + song + "'\n");
        }

        // For loop to show all results data
        for (var x = 0; x < results.length; x++) {
            console.log("Artist: " + results[x].artist + "\nSong:  " + results[x].song + "\nSpotify Preview Link: " + results[x].preview + "\nAlbum: " + results[x].album + "\n");;
        }
    });


}

function movieThis(inputString) {
    console.log("===========================");
    console.log("Calling Movie-This Function");
    console.log("===========================\n");

    // Variable used to create and store the movie name received from the user at terminal command line
    var movieName = "";

    var bodyResponse = "";

    // Condition check to see if inputString has one long string as a single array
    // If so, splits up that array into multiple words using the spaces in between
    if (inputString.length === 1) {
        inputString = inputString[0].split(" ");
    }

    // Condition check to see if the array is empty
    // If it is empty, then defeault the movieName to Mr Nobody
    if (inputString.length === 0) {
        console.log("No movie title specified, defaulting to 'Mr Nobody'\n");
        movieName = "Mr+Nobody";
    }
    else {

        // Capture all the words in the given song name (starts at 3 to ignore the first 2 process.argv values (node.js location + javascript file location) and the 3rd one(command sent to liri.js) )
        for (var x = 0; x < inputString.length; x++) {
            // Build a string with the song name
            // Condition check for loop starting at 3 to prevent extra blank space being added in front of the song name
            if (x === 0) {
                movieName = movieName + inputString[x];
            } else {
                movieName = movieName + "+" + inputString[x];
            }
        }
    }

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // console.log("error");
        // console.log(error);
        // console.log("");

        // console.log("testing true/false on error");
        // console.log(!error);
        // console.log("");

        // console.log("response");
        // console.log(response);
        // console.log("");
        // console.log(response.statusCode);

        // console.log("body");
        // console.log(body);
        // console.log("");
        // console.log(JSON.parse(body).Response)
        bodyResponse = JSON.parse(body).Response;
        // console.log("bodyResponse:  " + bodyResponse);
        // console.log(JSON.parse(body).Error)

        // If the request is successful
        if (bodyResponse === "True" && response.statusCode === 200) {

            // console.log(JSON.parse(body));
            // console.log("");

            var ratingsArray = JSON.parse(body).Ratings;

            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);


            // varaibles use to store new value from re-mapping ratingsArray while searching for specific rating name with indexOf method
            var findIMDB = ratingsArray.map(function (e) { return e.Source; }).indexOf("Internet Movie Database");
            var findRT = ratingsArray.map(function (e) { return e.Source; }).indexOf("Rotten Tomatoes");

            // Condition check to see if IMDB score is available in body.Ratings
            // value of -1 means not found
            if (findIMDB != -1)
            {
                console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);

            }
            else {
                console.log("IMDB Rating: Not Found");
            }

            // Condition check to see if Rotten Tomatoes score is available in body.Ratings
            // value of -1 means not found
            if (findRT != -1)
            {
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);

            }
            else {
                console.log("Rotten Tomatoes Rating: Not Found");
            }

            console.log("Country Produced In: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        } else if (bodyResponse === "False") {
            console.log("Error detected:");
            console.log(JSON.parse(body).Error)
        }
    });
}

function doWhatItSays() {
    console.log("================================");
    console.log("Calling Do-What-It-Says Function");
    console.log("================================\n");

    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        var doItNow = dataArr[0];
        var query = dataArr[1].split(" ");

        switch (doItNow) {
            case "spotify-this-song":
                console.log("spotify-this-song detected in file\n");
                spotifyThisSong(query);
                break;
            case "movie-this":
                console.log("movie-this detected in file\n");
                movieThis(query);
                break;
            case "weather-this":
                console.log("weather-this detected in file\n");
                weatherThis(query);
                break;
        }

    });
}

function weatherThis(inputString) {
    console.log("Weather This");
}