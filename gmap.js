/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * Initialize Required Variables 
 * such as start position and end position, map and direction service  
 */
var map;
var originPosition;
var destPosition = "282 2nd street 4th floor, San Francisco, CA 94105";
var transitType;
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
google.maps.event.addDomListener(window, 'load', initialize);
var layover = document.getElementById("layOver");
var layovers = [];
var travelMode;

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
        zoom: 16,
        center: originPosition //new google.maps.LatLng(-34.397, 150.644)
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsDisplay.setMap(map);
    
}


/*
 * Get Current Location coordinates of the user
 */
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        originPosition = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

        /*
         * Show where the user is map canvas
         * @type google.maps.InfoWindow
         */
        var infowindow = new google.maps.InfoWindow({
            map: map,
            position: originPosition,
            content: 'You are here'
        });

        map.setCenter(originPosition);

    }, function () {
        //either user denied or failed to load Geolocation
        handleNoGeolocation(true);
    });
} else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
}

/*
 * 
 * @param {type} errorFlag
 * @returns {undefined}
 * handle any problem with Geolocation
 */
function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

//Show map when page is loaded

function calcWalkingRoute() {
    travelMode = google.maps.DirectionsTravelMode.WALKING;
    routing();
    
}
     
function calcBicycleRoute(){
  travelMode = google.maps.DirectionsTravelMode.BICYCLING;
  routing();
}

function routing(){
     var request = {
        origin: originPosition,
        destination: destPosition,
        waypoints: layovers,
        travelMode: travelMode
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            new google.maps.DirectionsRenderer({
  map: map,
  panel: document.getElementById('direct-List'),
  directions: response
});
        }
    });
    document.getElementById("direct-List").innerHTML = "Direction will be available here!";
}


function calcTransitRoute(){
   travelMode = google.maps.DirectionsTravelMode.TRANSIT;
   routing();
}

function reRouteWithLayover(){  
    var request = {
    location: map.getCenter(),
    radius: '500',
    query: 'coffee shop'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < 1; i++) {
      var place = results[i];
    //  alert(results[i].geometry.location);
      layovers.push({location: results[i].geometry.location, stopover: true});
    }
  }
}