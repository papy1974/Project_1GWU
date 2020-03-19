
    
    $(document).ready(function(){
        
        //This is where the site prompts you to "know your location"
        //We need to figure out how to make this NOT prompt and ask in the page
        navigator.geolocation.getCurrentPosition(showPosition);

        function showPosition(position) {
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
                var birdArray = []; //create an array to store the different bird names
                function buildBirdArray(item,index){ //build an array of the names returned from eBird
                    console.log(item.comName); //just checking that it's grabbing the names that I want
                    birdArray.push(item.comName); //adds the "common name" as a new item to the end of the array
                }
                response.forEach(buildBirdArray); //calls the fundtion to build the bird array
                birdArray.sort(); //now that the bird array is built, this sorts them
                 
                birdArray.forEach(function(bird){ //this goes through each bird in the birdArray
                    var header = $("<div>");
                    var content = $("<div>");
                    var card = $("<div>");

                    header.addClass("ui content center aligned");
                    header.text(bird);

                    content.addClass("ui content");
                    content.text("This is a content");

                    card.addClass("ui card");
                    card.append(header);
                    card.append(content);

                    $("body").append(card);
/*                    var newBtn = $("<div>") //it creates a new button
                    newBtn.addClass("ui card bird"); //it adds the class "bird" to the button
                    newBtn.text(bird); //it adds the text of the brd name to the button
                    $("body").append(newBtn); //it adds the button to the div with the class .buttons
                    $(".buttons").append($("<p>")); //it adds a break in between the buttons*/
                })

            })
        }

    } )
       
