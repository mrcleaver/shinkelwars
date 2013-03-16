hasLoaded = false; 



/*CMarker */
CMarkers = new Meteor.Collection("Marker"); 


if(Meteor.isServer){

	Meteor.publish("PlayerMarkers", function(){
		var self = this; 
		var initializing = true; 
		var handle = CMarkers.find({}).observeChanges({
			added: function(id, field){
	
					self.added("displayMarkers", id, field);	
				
			},
			removed: function(id, field){
			
					self.removed("displayMarkers", id, field); 
				
			}
		});

		initializing = false; 
		self.ready(); 
		
		self.onStop(function(){
			handle.stop()
		}); 

	});

	Meteor.methods({
		createMarker: function(gameId, lat, lng){
			var time = new Date().getTime(); 
			var marker =  CMarkers.insert({
				gameId: gameId, 
				owner: this.userId,
				lat: lat, 
				lng: lng,
				createTime: time
			});

			console.log("Saved a marker: " + marker); 
		}
	})
}


/* CNation */
CNations = new Meteor.Collection("PlayerNation"); 

if(Meteor.isServer){
	Meteor.publish("PlayerNation", function(){
		return CNations.find({owner: Meteor.userId()});
	}); 

	Meteor.publish("AllNations", function(){
		return CNations.find({}, {fields:{nationname: 1}});
	}); 
}


if(Meteor.isServer)
{
	Meteor.methods({
		createNation: function(gameId, nationName, nationType){
			if(Meteor.userId == null){
				throw new Meteor.Error(400, "You must be logged in to create a country"); 
			}

			var nation = CNations.findOne({owner: Meteor.userId()});

			if(nation != undefined){
				console.log("Player has an existing nation: " + nation.nationname + " is loaded"); 
				return nation._id; 
			}

			console.log("Creating a new nation with player name: " + nationName + " and joining game " + gameId); 
			return CNations.insert({
				owner: this.userId, 
				nationname: nationName,
				game: gameId, 
				nation: nationType, 
				value: 100
			});
		}
	});
}

CGame = new Meteor.Collection("Game"); 

if(Meteor.isServer){
	Meteor.methods({
		joinGame: function(){
			var openGame = CGame.findOne({}); 
			if(openGame == undefined){
				console.log("No games found, creating a new game"); 
				var id = CGame.insert({}); 
				console.log("Created new game with id " + id); 
				return id;
			}else{
				console.log("An existing game with id " + openGame._id + " was found"); 
				return openGame._id; 
			}
		}
	});
}