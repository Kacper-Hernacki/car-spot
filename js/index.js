//some variables
var map;
var markers = [];
var infoWindow;


if(navigator.geolocation)
  navigator.geolocation.getCurrentPosition(function(position){
    var markerYourLocation = new google.maps.Marker({
      position: {lat: position.coords.latitude, lng: position.coords.longitude},
      map: map,
      icon: 'location.png',
      draggable: true

    });   
    markers.push(markerYourLocation);
  });
 
/////////////////////////////////////////////////////////////////////
//initialization of the map
function initMap() {
    var Warsaw = {
        lat: 52.237049, 
        lng: 21.017532
    };

//customizing the map
    var styledMapType = new google.maps.StyledMapType(
        [
          {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{color: '#c9b2a6'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{color: '#dcd2be'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#ae9e90'}]
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#93817c'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{color: '#a5b076'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#447530'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#f5f1e6'}]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{color: '#fdfcf8'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#f8c967'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#e9bc62'}]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{color: '#e98d58'}]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{color: '#db8555'}]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#806b63'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{color: '#8f7d77'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#ebe3cd'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{color: '#b9d3c2'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#92998d'}]
          }
        ],
        {name: 'Styled Map'});


    map = new google.maps.Map(document.getElementById('map'), {
        center: Warsaw,
        zoom: 12,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
          }
    });
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    infoWindow = new google.maps.InfoWindow();
    searchStores();
    showStoresMarkers(stores);
}
/////////////////////////////////////////////////////////////////////

//searching stores
function searchStores() {
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
      console.log('higigi');
        for(var store of stores){
            var postal = store['address']['postalCode'].substring(0, 6);
            if(postal == zipCode) {
              console.log('yees');
            foundStores.push(store);
            }
        }
    } else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function createTrigger(index) {
    new google.maps.event.trigger(markers[index], 'click');
}

function setOnClickListener() {
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index) {      
        elem.addEventListener('click', function() {
            new google.maps.event.trigger(markers[index], 'click');
        })
     })
}

//display locations in scrolling container
function displayStores(stores){
  var storesHtml = '';
  for(var [index, store] of stores.entries()){
      var address = store['addressLines'];
      var phone = store['phoneNumber'];
      storesHtml += `
          <div class="store-container">
              <div class="store-container-background">
                  <div class="store-info-container">
                      <div class="store-address">
                          <span>${address[0]}</span>
                          <span>${address[1]}</span>
                      </div>
                      <div class="store-phone-number">${phone}</div>
                  </div>
                  <div class="store-number-container">
                      <div class="store-number">
                          ${index+1}
                      </div>
                  </div>
              </div>
          </div>
      `
      document.querySelector('.stores-list').innerHTML = storesHtml;
  }
}

//display markers
function showStoresMarkers(stores){
    var bounds = new google.maps.LatLngBounds();
    for(var [index, store] of stores.entries()){
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        var name = store["name"];
        var address = store["addressLines"][0];
        var openStatusText = store["openStatusText"];
        var phoneNumber = store["phoneNumber"];
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phoneNumber, index+1);
    }
    map.fitBounds(bounds);
}

//creating info window and marker
function createMarker(latlng, name, address, openStatusText, phoneNumber, index){
    var html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="circle">
                  <i class="fas fa-location-arrow"></i>
                </div>
                ${address}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                  <i class="fas fa-car"></i>
                </div>
                ${phoneNumber}
            </div>
        </div>
    `;
    
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: index.toString()
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}



 


  