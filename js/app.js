var Location = function(data) {
	var self = this;
	this.title = data.title;
	this.lat = data.location.lat;
	this.lng = data.location.lng;

	this.visible = ko.observable(true);

	this.searchString = '<div class="content"><div class="title"><b>' + data.title + "</b></div>";

	this.infoWindow = new google.maps.InfoWindow({content: self.searchString, maxWidth:200});

	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(this.lat, this.lng),
			map: map,
			icon: data.icon,
			title: data.title
	});

	this.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);

	this.marker.addListener('click', function(){

// code reference from codepen website
        var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ data.title + "&format=json&callback=?"; 
		$.ajax({
			url: url,
			type: 'GET',
			contentType: "application/json; charset=utf-8",
			async: true,
        	dataType: "json",
          // plop data
        	success: function(data, status, jqXHR) {
        		$("#output").html("");
        		$("#output").html();
        		if (data[1].length>=0) {
        		for(var i=0;i<data[1].length;i++){
        			this. searchString = '<div><div class="output"><a href=' +data[3][i]+ '><h2>' + data[1][i]+ '</h2> + <h2 class="output">' + data[2][i] + "</h2></a></div></div>";
        			self.infoWindow.setContent(this.searchString);
        		}
        	}
        	else{
        		alert("no information");
        	}

        	}
		})
		.fail(function() {
			alert("Oops! Failed to load");
		});

		self.searchString = '<div class="content"><div class="title"><b>' + data.title + "</b></div>";

        self.infoWindow.setContent(self.searchString);

		self.infoWindow.open(map, this);

		self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 2100);
	});

	this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};
};

/*function ViewModel() {
    var self = this;

    self.content = ko.observableArray();
};

var viewModel = new ViewModel();

ko.applyBindings(viewModel);*/

function search() {
	var self = this;

	this.searchText = ko.observable("");

	this.locationList = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: {lat:12.9141 , lng:74.8560 }
	});

	locations.forEach(function(locationItem){
		self.locationList.push( new Location(locationItem));
	});

	this.filteredList = ko.computed( function() {
		var filter = self.searchText().toLowerCase();
		if (!filter) {
			self.locationList().forEach(function(locationItem){
				locationItem.visible(true);
			});
			return self.locationList();
		} else {
			return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
				var string = locationItem.title.toLowerCase();
				var result = (string.search(filter) >= 0);
				locationItem.visible(result);
				return result;
			});
		}
	}, self);
}

function errorHandling() {
	alert("Google Maps failed to load");
}

function main() {
	ko.applyBindings(new search());
}

var mq = window.matchMedia('all and (max-width: 880px)');
if(mq.matches){
$( ".cross" ).hide();
$( ".menu" ).hide();
$( ".hamburger" ).click(function() {
$( ".menu" ).slideToggle( "slow", function() {
$( ".hamburger" ).hide();
$( ".cross" ).show();
});
});
$( ".cross" ).click(function() {
$( ".menu" ).slideToggle( "slow", function() {
$( ".cross" ).hide();
$( ".hamburger" ).show();
});
});
}