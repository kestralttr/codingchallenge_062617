
function setNewLatLng(newMapData, position) {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
}

function setNewMap(latLng) {
  return new google.maps.Map(document.getElementById("googleMap"), {
    zoom: 12,
    center: latLng
  });
}

function setupMapWithCurrentPosition(mapData) {
  let newMapData = {
    latLng: null,
    map: null
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      // save newly incoming map data after getting position
      newMapData.latLng = setNewLatLng(newMapData, position);
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

function removeMarkers(markers) {
  if(markers.length > 0) {
    markers.forEach(function(m) {
      m.setMap(null);
    });
  }
}

function setupPlaceList(mapData,placeData,request,resultsList) {
  let service = new google.maps.places.PlacesService(mapData.map);
  service.textSearch(request, callback);

  function callback(results, status) {
    removeMarkers(placeData.markers);
    placeData.markers = [];
    placeData.places = [];
    resultsList.innerHTML = "";

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        let place = results[i];
        placeData.places.push(place);
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();

        let newPlace = document.createElement("li");
        newPlace.classList.add("results-list-item");
        newPlace.innerHTML = place.name;

        // console.log("newPlace: ",newPlace);

        let newLat = place.geometry.location.lat();
        let newLng = place.geometry.location.lng();

        newPlace.addEventListener("mouseenter", function(e) {
          e.preventDefault();
          placeData.markers[i].setAnimation(google.maps.Animation.BOUNCE);
        });
        newPlace.addEventListener("mouseleave", function(e) {
          e.preventDefault();
          placeData.markers[i].setAnimation(null);
        });
        newPlace.addEventListener("click", function(e) {
          e.preventDefault();
          mapData.map.setCenter({lat:newLat,lng:newLng});
          mapData.map.setZoom(15);
        });

        resultsList.appendChild(newPlace);

        let newMarker = new google.maps.Marker({
          position: {lat,lng},
          map: mapData.map,
          title: place.name
        });
        placeData.markers.push(newMarker);

      }
    }
  }
}

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

function setupSearchFunctionality(mapData) {
  let searchButton = document.getElementById("search-button");
  let queryInput = document.getElementById("query-input");
  let resultsList = document.getElementById("results-list");
  let markers = [];
  let places = [];

  let placeData = {
    markers: [],
    places: []
  };

  addSearchListener(searchButton,queryInput,mapData,placeData,resultsList);
}

function initMap() {

  let mapData = {
    latLng: null,
    map: null
  };

  setupMapWithCurrentPosition(mapData);

  setupSearchFunctionality(mapData);
}
