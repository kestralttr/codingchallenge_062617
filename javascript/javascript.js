function initMap(arg) {

  let myLatLng;
  let myMap;


  let infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      myLatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(myLatLng);

      myMap = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 13,
        center: myLatLng
      });

    }, function() {
      handleLocationError(true, infoWindow, myMap.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, myMap.getCenter());
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(myMap);
  }

  let searchButton = document.getElementById("search-button");
  let queryInput = document.getElementById("query-input");
  let resultsList = document.getElementById("results-list");
  let markers = [];
  let places = [];

  searchButton.addEventListener("click", function(e) {
    e.preventDefault();
    console.log(queryInput.value);
    // initMap(queryInput.value);


    let input = queryInput.value;

    if(input === "") {
      return;
    }

    console.log(input);

    let request = {
      location: myLatLng,
      radius:'2000',
      types: [input]
    };

    service = new google.maps.places.PlacesService(myMap);
    service.nearbySearch(request, callback);

    function callback(results, status) {
      if(markers.length > 0) {
        markers.forEach(function(m) {
          // console.log(m);
          m.setMap(null);
        });
      }
      markers = [];
      places = [];
      resultsList.innerHTML = "";
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
          let place = results[i];
          places.push(place);
          let lat = place.geometry.location.lat();
          let lng = place.geometry.location.lng();

          let newPlace = document.createElement("li");
          newPlace.classList.add("results-list-item");
          newPlace.innerHTML = place.name;

          console.log("newPlace: ",newPlace);

          let newLat = place.geometry.location.lat();
          let newLng = place.geometry.location.lng();

          newPlace.addEventListener("mouseenter", function(e) {
            e.preventDefault();
            markers[i].setAnimation(google.maps.Animation.BOUNCE);
          });
          newPlace.addEventListener("mouseleave", function(e) {
            e.preventDefault();
            markers[i].setAnimation(null);
          });
          newPlace.addEventListener("click", function(e) {
            e.preventDefault();
            myMap.setCenter({lat:newLat,lng:newLng});
            myMap.setZoom(15);
          });

          resultsList.appendChild(newPlace);

          let newMarker = new google.maps.Marker({
            position: {lat,lng},
            map: myMap,
            title: place.name
          });
          markers.push(newMarker);

        }
        console.log(places);
      }
    }


  });

}
