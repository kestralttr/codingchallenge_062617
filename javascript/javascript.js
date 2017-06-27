function initMap(arg) {

  let myLatLng = {lat: 41.850033, lng: -87.6500523};

  let myMap = new google.maps.Map(document.getElementById('googleMap'), {
    zoom: 15,
    center: myLatLng
  });

  let input;

  if(arg === "") {
    input = "resturant";
  } else {
    input = arg;
  }

  console.log(input);

  let request = {
    location: myLatLng,
    radius:'500',
    types: [input]
  };

  service = new google.maps.places.PlacesService(myMap);
  service.nearbySearch(request, callback);

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        let place = results[i];
        console.log(place.name);
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();

        new google.maps.Marker({
          position: {lat,lng},
          map: myMap,
          title: place.name
        });

      }
    }
  }

}

(function() {
  let searchButton = document.getElementById("search-button");
  let queryInput = document.getElementById("query-input");

  searchButton.addEventListener("click", function(e) {
    e.preventDefault();
    console.log(queryInput.value);
    initMap(queryInput.value);
  });


})();
