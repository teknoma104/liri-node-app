# LIRI Bot

### Overview

A Node.js assignment where I was tasked with creating LIRI. LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and gives you back data.

### Features

LIRI has 4 major functions built into it.

   * Weather-This
   
   * Spotify-This-Song
   
   * Movie-This

   * Do-What-It-Says

### Functionality Explained

1. Weather-This
    * Syntax usage:  `node liri.js weather-this`
    * Weather-This does not accept any parameters from the command line.
    * What it does is when the above synatx is sent, it will prompt the user with selecting a choice between searching the weather via city name or a zip code.
        * Depending on how the user answers the first question, the next one will show the next question asking the user to either input a city name or zip code.
    * After receiving the inputted information from the user, Weather-This will query the OpenWeatherMap API to get the weather in that specified location.
        * Weather-This will show an error 404 code if the user provides inputted information that yields no results from the call to OpenWeatherMap API.
    * NPM packages used - [Inquirer](https://www.npmjs.com/package/inquirer), [Request](https://www.npmjs.com/package/request)

2. Spotify-This-Song
    * Syntax usage:  `node liri.js spotify-this-song I Want It That Way` or `node liri.js spotify-this-song "I Want It That Way"`
    * Spotify-This-Song does accept a song name parameter from the command line.
    * What it does is after the command is sent to LIRI is that it'll take the song name and uses it as a query to send a call to  Spotify's API.
        * If there are results found from the call, it will pull up to the top 5 results and displays the following for each result found:
            ```
                * Artist(s)'s name(s)
                * The song's name
                * A preview link of the song from Spotify
                * The album that the song is from
            ```
        * If the user does not enter a song name when sending the command, it will default the search name to Ace of Base's "The Sign"
        * If no results were found from the call to Spotify's API then an error message will display
    * NPM package used - [node-spotify-api](https://www.npmjs.com/package/node-spotify-api)

3. Movie-This
    * Syntax usage:  `node liri.js movie-this The Dark Knight` or `node liri.js movie-this "The Dark Knight"`
    * Movie-This does accept a movie name parameter from the command line.
    * What it does is after the command is sent to LIRI is that it'll take the movie name and uses it as a query to send a call to  Open Media Database's API.
        * If there are results found from the call, it will pull up the data and displays the following information:
            ```
                * Title of the movie.
                * Year the movie came out.
                * IMDB Rating of the movie.
                * Rotten Tomatoes Rating of the movie.
                * Country where the movie was produced.
                * Language of the movie.
                * Plot of the movie.
                * Actors in the movie.
            ```
        * If the user does not enter a song name when sending the command, it will default the search name to "Mr Nobody".
        * If no results were found from the call to OMDB's API then an error message will display.
        * Additionally, some movies do not have IMDB and/or Rotten Tomatoes scores, the function will note this when display the movie information for the user.
    * NPM package used - [Request](https://www.npmjs.com/package/request)

4. Do-What-It-Says
    * Syntax usage:  `node liri.js do-what-it-says`
    * Do-What-It-Says does not accept any parameters from the command line.
    * What it does is after the command is sent to LIRI is that it'll read from the random.txt and scans/parses whatever command is listed.
        * Depending on what command is typed in random.txt, it will make a call to the other 3 functions.
            ```
                * The format for the text in random.txt:
                    * Example format:  spotify-this-song,"I Want it That Way"
                    * The first part must be either:
                        * spotify-this-song
                        * movie-this
                        * weather-this
                    * The comma is important to seperate the name of the command and the parameter
            ```
    * NPM package used - [fs](https://www.npmjs.com/package/fs)