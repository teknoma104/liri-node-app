// Loads .dotenv containing locally stored API keys
require("dotenv").config();

// Load the NPM Packages: request, fs, inquirer
var request = require("request");
var fs = require("fs");
var inquirer = require("inquirer");

// Import our keys
var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

// constructor based on Spotify variable that requires the node-spotify-api from NPM
var spotify = new Spotify(keys.spotify);

// Takes in all of the command line arguments
var inputString = process.argv;

// Parses the command line argument to capture the user's command
var command = inputString[2];
var query = [];

for (var x = 3; x < inputString.length; x++) {
    query.push(inputString[x]);
}

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
        weatherThis();
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

        bodyResponse = JSON.parse(body).Response;

        // If the request is successful
        if (bodyResponse === "True" && response.statusCode === 200) {

            var ratingsArray = JSON.parse(body).Ratings;

            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);


            // varaibles use to store new value from re-mapping ratingsArray while searching for specific rating name with indexOf method
            var findIMDB = ratingsArray.map(function (e) { return e.Source; }).indexOf("Internet Movie Database");
            var findRT = ratingsArray.map(function (e) { return e.Source; }).indexOf("Rotten Tomatoes");

            // Condition check to see if IMDB score is available in body.Ratings
            // value of -1 means not found
            if (findIMDB != -1) {
                console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);

            }
            else {
                console.log("IMDB Rating: Not Found");
            }

            // Condition check to see if Rotten Tomatoes score is available in body.Ratings
            // value of -1 means not found
            if (findRT != -1) {
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

function weatherThis() {
    console.log("=============================");
    console.log("Calling Weather-This Function");
    console.log("=============================\n");

    inquirer.prompt([
        {
            type: "list",
            name: "searchType",
            message: "Search weather by city or zip code?",
            choices: ["City", "Zip Code"]
        }
    ]).then(function (response) {

        if (response.searchType === "City") {

            inquirer.prompt([
                {
                    type: "input",
                    name: "userCity",
                    message: "Enter the city name:  "
                }]).then(function (cityresponse) {
                    var userCityName = cityresponse.userCity;

                    // Replaces spaces in city name with + for the query URL
                    var queryCityName = userCityName.split(' ').join('+');

                    // Then run a request to the OpenWeatherMap API with the location specified
                    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + queryCityName + "&units=imperial" + "&APPID=" + keys.openweathermap.APPID;
                    
                    request(queryUrl, function (error, response, body) {
                        
                        // JSON'ing the body response and storing into weather, making it in a more readable format to easily discern name of attributes
                        var weather = JSON.parse(body);

                        // If there were no errors and the response code was 200 (i.e. the request was successful)...
                        if (!error && response.statusCode === 200) {
                            console.log("\nWeather currently in " + userCityName + ":");
                            console.log("It's " + weather.main.temp + " degrees Fahrenheit.");
                            console.log("Humidity is currently " + weather.main.humidity + ".");
                            console.log("Wind is currently blowing " + weather.wind.speed + "mph from the direction of " + weather.wind.deg + ".");
                            console.log("Currently the cloud coverage is " + weather.clouds.all + "%.");

                            var weatherConditions = weather.weather;
                            var str = "";

                            // Used to find out and display all of the weather conditions in the weather.weather array that we get back from the request response
                            for (var x = 0; x < weatherConditions.length; x++) {
                                if (x === weatherConditions.length - 1) {
                                    str += weatherConditions[x].main + "(" + weatherConditions[x].description + ")";
                                }
                                else {
                                    str += weatherConditions[x].main + "(" + weatherConditions[x].description + ")" + ', ';
                                }
                            }
                            console.log("Current weather condition(s):  " + str);

                        } else if (response.statusCode === 404) {
                            console.log("Error detected! See below for error message returned.");
                            console.log("Error Code " + weather.cod + ": " + weather.message);
                        }
                    });

                })

        }
        else if (response.searchType === "Zip Code") {

            inquirer.prompt([
                {
                    type: "input",
                    name: "userZipCode",
                    message: "Enter the zip code:  "
                }]).then(function (zipCodeResponse) {
                    var userZipCode = zipCodeResponse.userZipCode;

                    // Then run a request to the OpenWeatherMap API with the location specified
                    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?zip=" + userZipCode + "&units=imperial" + "&APPID=" + keys.openweathermap.APPID;

                    request(queryUrl, function (error, response, body) {

                        // JSON'ing the body response and storing into weather, making it in a more readable format to easily discern name of attributes
                        var weather = JSON.parse(body);

                        // If there were no errors and the response code was 200 (i.e. the request was successful)...
                        if (!error && response.statusCode === 200) {
                            console.log("\nDisplaying weather for requested Zip Code (" + userZipCode + ").");
                            console.log("Weather currently in " + weather.name + ":");
                            console.log("It's " + weather.main.temp + " degrees Fahrenheit.");
                            console.log("Humidity is currently " + weather.main.humidity + ".");
                            console.log("Wind is currently blowing " + weather.wind.speed + "mph from the direction of " + weather.wind.deg + ".");
                            console.log("Currently the cloud coverage is " + weather.clouds.all + "%.");

                            var weatherConditions = weather.weather;
                            var str = "";

                            // Used to find out and display all of the weather conditions in the weather.weather array that we get back from the request response
                            for (var x = 0; x < weatherConditions.length; x++) {
                                if (x === weatherConditions.length - 1) {
                                    str += weatherConditions[x].main + "(" + weatherConditions[x].description + ")";
                                }
                                else {
                                    str += weatherConditions[x].main + "(" + weatherConditions[x].description + ")" + ', ';
                                }
                            }
                            console.log("Current weather condition(s):  " + str);

                        } else if (response.statusCode === 404) {
                            console.log("Error detected! See below for error message returned.");
                            console.log("Error Code " + weather.cod + ": " + weather.message);
                        }
                    });

                })

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

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

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
