$(document).ready(function(){
    
    var birdArray = []; //create an array to store the different bird names
 //This is where the site prompts you to "know your location"
 //We need to figure out how to make this NOT prompt and ask in the page
    navigator.geolocation.getCurrentPosition(showPosition);
    ///Jack's modal button click to Begin
    


    
    function showPosition(position) {
        var numOfResults;
        $("#modalButton1").click(function(){
            $(".birdModal").modal({
              closable: false,
            //   allowMultiple: true    
              }).modal("show");
              $("#intro").remove();
              $('#modalButton1').transition('scale');
            });
        $("#inputButton2").click(function(event){
            event.preventDefault()  
            
            numOfResults = $("#inputBox2").val();
            if (numOfResults >25){
                numOfResults = 25;
            }
            
        
    //this uses the position that is passed from getCurrentPosition
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
    //this rounds the latitude and longitude because ebird only accepts up to 2 decimal places
        lat = Math.round(lat);
        lon = Math.round(lon);
    //this is my key for eBird
        var key = "h0q6tfu7bqtt";
    //this is the Max number of results eBird will return, need to get it out of a prompt
/////////////        var numOfResults = prompt("How many birds would you like to see?");
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
                var birdName = item.comName; //stores the bird name from eBird, used for labelling the bird cards
                var birdCode = item.speciesCode; //stores the species code from eBird, used for looking up pictures
                var sciName = item.sciName; //stores the, used for looking up sounds
                var thisBird = {"name":birdName,
                                "code":birdCode,
                                "sciName": sciName,
                                "images": [],
                                "sounds": []
                                }
                //////////GET PICTURES///////////////////////
                queryUrl = `https://search.macaulaylibrary.org/catalog.json?searchField=species&q=&taxonCode=${birdCode}&hotspotCode=&regionCode=&customRegionCode=&userId=&_mediaType=on&mediaType=all&species=&region=&hotspot=&customRegion=&mr=M1TO12&bmo=1&emo=12&yr=YALL&by=1900&ey=2020&user=&view=Gallery&sort=upload_date_desc&_req=on&cap=no&subId=&catId=&_spec=on&specId=&collection=&collectionCatalogId=`
                $.ajax({
                    method: 'GET',
                    url: queryUrl
                }).then(response => {
                    console.log(queryUrl);
                    console.log("BirdImages");
                    console.log(response);
                    var images = [];
                    for (i=0; i<5; i++){
                        images[i] = response.results.content[i].previewUrl;
                    }
                    thisBird.images = images;
                    console.log("images added");
                    console.log(thisBird);
                    /////////DONE GETTING PICTURES/////////////////////
                    /////////Get SOUNDS////////////////
                    $.ajax({
                        url: "https://www.xeno-canto.org/api/2/recordings?query=" + sciName,
                        method: "GET"
                    }) .then(function(response) {
                        console.log("sound API");
                        console.log(response);
                        for (i=0; i<3; i++ ) {
                            var birdSound = (response.recordings[i].file);  
                            thisBird.sounds[i] = "https:" + birdSound;
                        }
                        console.log("Sounds Added");
                        console.log(thisBird);
                        ////////////////////////
                        var card = $("<div>");
                        var header = $("<div>");
                        var content = $("<div>");
                        var animalImage=$("<img>");
                        var description= $("<div>");
                        var pOne =$("<p>")
                        var audioControls1 = $("<audio controls>");
                        var audioControls2 = $("<audio controls>");
                        var audioControls3 = $("<audio controls>");
                        var source1 = $("<source>");
                        var source2 = $("<source>");
                        var source3 = $("<source>");
                        ///We have 3 available sounds, but are only using one here
                        source1.attr("src", thisBird.sounds[0]);
                        source2.attr("src", thisBird.sounds[1]);
                        source3.attr("src", thisBird.sounds[2]);
                        audioControls1.append(source1);
                        audioControls2.append(source2);
                        audioControls3.append(source3);
                        description.append(audioControls1);  
                        description.append(audioControls2);
                        description.append(audioControls3);
                        animalImage.attr("src", thisBird.images[0]);
                        animalImage.addClass("birdImg");
                                
                        header.addClass("ui content center aligned");
                        header.text(thisBird.name);
                
                        content.addClass("ui content center aligned");
                        // description.text("This is a content");
                        // pOne.text("This is a paragraph");                 
                                
                        card.addClass("ui card");
                        card.append(header);
                        card.append(content);
                        content.append(animalImage);
                        description.append(pOne);
                        content.append(description);
                                
                
                    $("#birdcards").append(card);
                    })
                    /////////DONE GETTING SOUNDS////////////////
                })
                console.log(thisBird);
                birdArray.push(thisBird); //adds the object of the bird name and the bird code as a new item to the end of the array
            }
            response.forEach(buildBirdArray); //calls the fundtion to build the bird array
            
                })
            })
        }

       
    } )
