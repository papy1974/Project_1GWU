$(document).ready(function(){

    var birdArray = []; //create an array to store the different bird names

    //This is where the site prompts you to "know your location"
    //We need to figure out how to make this NOT prompt and ask in the page
navigator.geolocation.getCurrentPosition(myPosition);

    function myPosition (position) {
        //this uses the position that is passed from getCurrentPosition
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        //this rounds the latitude and longitude because ebird only accepts up to 2 decimal places
        lat = Math.round(lat);
        lon = Math.round(lon);
        //this is my key for eBird
        var key = "h0q6tfu7bqtt";
        //this is the Max number of results eBird will return, need to get it out of a prompt
        var numOfResults = prompt("How many birds would you like to see?");
        //this builds the queryUrl to eBird
        var queryUrl = "https://api.ebird.org/v2/data/obs/geo/recent?lat="+lat+"&lng="+lon+"&maxResults="+numOfResults+"&X-eBirdApiToken:" + key;
        console.log(queryUrl); //just checking that the queryUrl is built the way I expect it
        $.ajax({
            url: queryUrl,
            headers: {"X-eBirdApiToken": "h0q6tfu7bqtt"}, //eBird requires this format
            method: "GET"
        })
        .then(function(response){
            console.log(response); //making sure eBird is returning SOMETHING

            function buildBirdArray(item,index){ //build an array of the names returned from eBird
                console.log(item.comName); //just checking that it's grabbing the names that I want
                console.log(item.speciesCode);
                var birdName = item.comName;
                var birdCode = item.speciesCode;
                var sciName = item.sciName;
                $.ajax({
                    method: "GET",
                    url: `https://search.macaulaylibrary.org/catalog.json?searchField=species&q=&taxonCode=${birdCode}&hotspotCode=&regionCode=&customRegionCode=&userId=&_mediaType=on&mediaType=all&species=&region=&hotspot=&customRegion=&mr=M1TO12&bmo=1&emo=12&yr=YALL&by=1900&ey=2020&user=&view=Gallery&sort=upload_date_desc&_req=on&cap=no&subId=&catId=&_spec=on&specId=&collection=&collectionCatalogId=`
                }).then(response => {
                    console.log("BirdImages");
                    console.log(response);
                    var birdImage = response.results.content[0].previewUrl;
                    //////////////////
                    $.ajax({
                          url: "https://www.xeno-canto.org/api/2/recordings?query=" + sciName,
                          method: "GET"
                        })
                          .then(function(response) {
                              console.log("sound API");
                            console.log(response);
                            var birdSound = (response.recordings[0].url);
                            var thisBird = {"name":birdName,
                                            "code":birdCode,
                                            "sciName": sciName,
                                            "birdImage": birdImage,
                                            "birdSound": birdSound
                                            }
                            console.log("This Bird Object");
                            console.log(thisBird);
                            birdArray.push(thisBird); //adds the object of the bird name and the bird code as a new item to the end of the array
                            console.log(birdArray);

                        });

                    ///////////////////


                });



            }





            response.forEach(buildBirdArray); //calls the fundtion to build the bird array

            // birdArray.sort(); //now that the bird array is built, this sorts them

            function compare(a,b){
                const birdA = a.name.toUpperCase();
                const birdB = b.name.toUpperCase();

                let comparison = 0;
                if(birdA > birdB) {
                    comparison = 1;
                } else if (birdA < birdB) {
                    comparison = -1;
                }
                return comparison;             
            }
            birdArray.sort(compare);

            birdArray.forEach(function(bird){ //this goes through each bird in the birdArray
                var newBtn = $("<button>") //it creates a new button
                newBtn.addClass("bird"); //it adds the class "bird" to the button
                newBtn.text(bird.name); //it adds the text of the brd name to the button
                $(".buttons").append(newBtn); //it adds the button to the div with the class .buttons
                $(".buttons").append($("<p>")); //it adds a break in between the buttons
            })
        })
    }


    function displayBirdPic(birdName) {


    }


} )