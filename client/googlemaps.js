var map; 

function initialize() {
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(46.283333, 86.666667),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  }
  document.getElementById("map_canvas").appendChild(document.createElement("strong")); 
  map = new google.maps.Map((document.getElementById("map_canvas")), mapOptions);
  console.log("Map rendered"); 
  setupEvents();
  Session.set("mapLoaded", true);  
}

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyDaWe0G1nPfJamJk5huiz6J6bAs-s3EFgs&sensor=false&callback=initialize";
  document.body.appendChild(script);
}

function setupEvents(){
    new google.maps.event.addListener(map, 'click', function(event){
    controllerPlaceMarker(event.latLng); 
  });
}

function controllerPlaceMarker(latLng){
  Meteor.call('createMarker', Session.get("gameId"), latLng.lat(), latLng.lng());
}

function drawMarker(location, title) {
  console.log("Drawing a marker"); 
  var marker = new google.maps.Marker({
      position: location,
      map: map, 
      title: title
  });
}