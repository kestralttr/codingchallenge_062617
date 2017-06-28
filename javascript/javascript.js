
// initMap is the primary function used to build Google Maps object
function initMap() {

  let mapData = {
    latLng: null,
    map: null
  };

  setupMapWithCurrentPosition(mapData);

  setupSearchFunctionality(mapData);
}

// returns an updated LatLng object based off of position
function setNewLatLng(position) {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
}

// uses a LatLng argument to instantiate a map and returns the map
function setNewMap(latLng) {
  return new google.maps.Map(document.getElementById("googleMap"), {
    zoom: 12,
    center: latLng
  });
}

// gets current position of user and updates mapData with correct values
function setupMapWithCurrentPosition(mapData) {
  let newMapData = {
    latLng: null,
    map: null
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      // save newly incoming map data after getting position
      newMapData.latLng = setNewLatLng(position);
      newMapData.map = setNewMap(newMapData.latLng);

      // assign new data to already declared map data
      mapData.latLng = newMapData.latLng;
      mapData.map = newMapData.map;

    }, function() {
      alert("You must allow access to your location in order to use this application.");
    });
  } else {
    // Browser doesn't support Geolocation
    alert("You must allow access to your location in order to use this application.");
  }

}

// iterates through the markers array and removes each marker from the map
function removeMarkers(markers) {
  if(markers.length > 0) {
    markers.forEach(function(m) {
      m.setMap(null);
    });
  }
}

// assigns mouseenter, mouseleave, and click event handlers on a newPlace list item
function assignEventListeners(idx,newPlace,placeData,mapData,newLat,newLng) {
  newPlace.addEventListener("mouseenter", function(e) {
    e.preventDefault();
    placeData.markers[idx].setAnimation(google.maps.Animation.BOUNCE);
  });
  newPlace.addEventListener("mouseleave", function(e) {
    e.preventDefault();
    placeData.markers[idx].setAnimation(null);
  });
  newPlace.addEventListener("click", function(e) {
    e.preventDefault();
    mapData.map.setCenter({lat:newLat,lng:newLng});
    mapData.map.setZoom(15);
  });
}

// adds a marker to the markers array based on place data
function setMarker(newLat,newLng,mapData,place,placeData) {
  let newMarker = new google.maps.Marker({
    position: {lat:newLat,lng:newLng},
    map: mapData.map,
    title: place.name
  });
  placeData.markers.push(newMarker);
}

// iterates through results from Google Places, creating newPlaces and appending them to the DOM
function buildPlaceListItems(results,placeData,mapData,resultsList) {
  for (let i = 0; i < results.length; i++) {
    let place = results[i];
    placeData.places.push(place);

    let newPlace = document.createElement("li");
    newPlace.classList.add("results-list-item");
    newPlace.innerHTML = place.name;

    let newLat = place.geometry.location.lat();
    let newLng = place.geometry.location.lng();

    assignEventListeners(i,newPlace,placeData,mapData,newLat,newLng);

    resultsList.appendChild(newPlace);

    setMarker(newLat,newLng,mapData,place,placeData);
  }
}

// confirms that OK status of the Google Places results and starts building them
function getPlaceData(mapData,placeData,resultsList,results,status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    buildPlaceListItems(results,placeData,mapData,resultsList);
  }
}

// fires the textSearch request to Google Places and prepares to update places/markers
function setupPlaceList(mapData,placeData,request,resultsList) {
  let service = new google.maps.places.PlacesService(mapData.map);
  service.textSearch(request, callback);

  function callback(results, status) {
    removeMarkers(placeData.markers);
    placeData.markers = [];
    placeData.places = [];
    resultsList.innerHTML = "";

    getPlaceData(mapData,placeData,resultsList,results,status);
  }
}

// adds the event listener for the search button and prepares the request
function addSearchListener(searchButton,queryInput,mapData,placeData,resultsList) {
  searchButton.addEventListener("click", function(e) {
    e.preventDefault();
    mapData.map.setCenter(mapData.latLng);
    mapData.map.setZoom(12);

    let input = queryInput.value;

    if(input === "") {
      return;
    }

    let request = {
      location: mapData.latLng,
      radius:"500",
      query: input
    };

    setupPlaceList(mapData,placeData,request,resultsList);

  });
}

// creates variables for DOM elements
function setupSearchFunctionality(mapData) {
  let searchButton = document.getElementById("search-button");
  let queryInput = document.getElementById("query-input");
  let resultsList = document.getElementById("results-list");

  let placeData = {
    markers: [],
    places: []
  };

  addSearchListener(searchButton,queryInput,mapData,placeData,resultsList);
}
