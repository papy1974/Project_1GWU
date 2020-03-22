

//this is the red click to begin button
$("#modalButton1").click(function(){
  $(".birdModal").modal({
    closable: false,
    allowMultiple: true    
    }).modal("show");
  });
 
$("#inputButton2").click(function(event){
  event.preventDefault()  
  
var birdName = $("#inputBox2").val();
console.log(birdName);
var queryURL = "https://www.xeno-canto.org/api/2/recordings?query=" + birdName;
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
      console.log(response);
      console.log(response.recordings[0].file)
      
    })});

  
  /*var audioControls = $("<audio controls>");
    var source = $("<source>");
    source.attr("src", "http://www.xeno-canto.org/sounds/uploaded/WZCOFQXSWJ/XC437780-sitta%20ledanti%20%C3%A0%20djimla%202018%2010%2007%20028.mp3")
    audioControls.append(source);  
    description.append(audioControls);
*/