
Meteor.subscribe("Nations"); 
Meteor.subscribe("AllNations"); 

Meteor.subscribe("PlayerMarkers");

displayMarkers = new Meteor.Collection("displayMarkers"); 

Meteor.autorun(function(){
  displayMarkers.find({}).forEach(function(marker){
    var latLng = new google.maps.LatLng(marker.lat, marker.lng); 
    drawMarker(latLng,marker.owner);
  });
});

  Meteor.autorun(function (handle) {
    if(Meteor.user()){
      console.log("User " + Meteor.user().username + " logged in"); 
      var gameId; 
      Meteor.call("joinGame", function(error, result){
        if(result != undefined){
          console.log(result); 
          gameId = result; 
          Session.set("gameId", gameId); 
          console.log("Joining game " + gameId); 
          Meteor.call("createNation", gameId, Meteor.user().username, "NATION"); 
        }else{
          console.log("Something went wrong: " + error); 
        }   
      });
      handle.stop();  
    }
  });

  Template.hello.rendered = function(){
    if(hasLoaded == false){
      loadScript(); 
      hasLoaded = true;
    }
  }

  Template.hello.nationscount = function(){
    return CNations.find({}); 
  }

  Template.hello.nations = function(){
    return CNations.find({}); 
  } 

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
