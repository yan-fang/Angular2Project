define(['angular'], function(angular) {
  'use strict';

  var GoogleMapsModule = angular.module('easeGoogleMap', ['ui.router', 'EaseProperties']);

  GoogleMapsModule.controller('mapController', function($state, $scope) {
    var vm = this;
    angular.extend(this, {
      getMapUri : getMapUri
    })

    function getCoordinates(location){
      var address;
      var coordinates;

      if(location.addressLine2) {
        address = encodeURIComponent(location.addressLine1 + ',' + location.addressLine2);
      } else {
        address = encodeURIComponent(location.addressLine1);
      }

      if(location.hasOwnProperty('locality') && location.hasOwnProperty('regionCode')) {
        coordinates = address + '+' +  location.locality + '+' + location.regionCode + '+'  +  location.postalCode + '+' + location.countryCode;
      } else {
        coordinates = address + '+' + location.city + '+' + location.stateCode + '+' +  location.postalCode + '+' + location.countryCode;
      }
      return coordinates;
    }

    function getMapUri(location) {
      var url = '';
      if(location) {
        var apiBaseUrl = 'https://maps.googleapis.com/maps/api/staticmap?center=';
        var coordinates = getCoordinates(location);
        var zoom = '&zoom=12';
        var size = '&size=400x250';
        var marker = '&markers=' + coordinates;
        var maptype = '&maptype=road&mobile=true';
        var key = '&key=gme-capitaloneservices1';
        url = apiBaseUrl + coordinates + zoom + size + marker + maptype;
      }
      return url;
    }
  });

  GoogleMapsModule.controller('mapModalController', function($state, $scope, $stateParams, $sce, EaseConstant) {
    var vm = this;

    angular.extend(this, {
      initialize : initialize,
      getMerchantLogo : getMerchantLogo,
      getMerchantName : getMerchantName,
      getMerchantAddress : getMerchantAddress,
      goToGoogleMaps : goToGoogleMaps,
      changeView : changeView,
      showStreetView : showStreetView,
      onMapView : true, // true when user is viewing map, false when user is viewing street
      hasStreetView : true,
      merchant: $stateParams['merchant'],
      location: $stateParams['location'],

      close: function() {
        $state.go('^');
      },

      initClose: false,
      modalType: 'mapModal'
    });

    if (!$stateParams.merchant || !$stateParams.location) {
      this.close();
    }

    function initialize(merchant) {
      if (merchant && merchant.geoLocation) {
        var latitude = parseFloat(merchant.geoLocation.latitude);
        var longitude = parseFloat(merchant.geoLocation.longitude);
        var latLng = {lat: latitude, lng: longitude};
        if (vm.onMapView) {
          var map = new google.maps.Map(document.getElementById('map'), {
            center: latLng,
            zoom: 12
          });
          var marker = new google.maps.Marker({
            position: latLng,
            map: map
          });
        } else {
          var street = new google.maps.StreetViewPanorama(document.getElementById('street'), {
            position: latLng,
            pov: {
              heading: 0,
              pitch: 0
            }
          });
        }
      }
    }

    function getMerchantLogo(merchant) {
      var logoURL;
      if (merchant) {
        if (merchant.logo) {
          logoURL = merchant.logo;
        } else if (merchant.logoURL) {
          logoURL = merchant.logoURL.href;
        }
        return logoURL;
      }
    }

    function getMerchantName(merchant) {
      if (merchant) {
        return merchant.name;
      }
    }

    function getMerchantAddress(location) {
      var addressLine;
      var address;
      if (location) {
        if (location.addressLine2) {
          addressLine = location.addressLine1 + " " + location.addressLine2;
        } else {
          addressLine = location.addressLine1;
        }
        if (location.hasOwnProperty('locality') && location.hasOwnProperty('regionCode')) {
          address = addressLine + ", " + location.locality + ", " + location.regionCode + " " + location.postalCode;
        } else {
          address = addressLine + ", " + location.city + ", " + location.stateCode + " " + location.postalCode;
        }
        return address;
      }
    }

    function goToGoogleMaps(location) {
      if (location) {
        return EaseConstant.googleMaps.kMapUrl + getCoordinates(location);
      }
    }

    function changeView() {
      vm.onMapView = !vm.onMapView;
    }

    function showStreetView(merchant) {
      if (merchant && merchant.geoLocation) {
        var latitude = parseFloat(merchant.geoLocation.latitude);
        var longitude = parseFloat(merchant.geoLocation.longitude);
        var latLng = {lat: latitude, lng: longitude};
        var checkStreetView = new google.maps.StreetViewService();
        checkStreetView.getPanoramaByLocation(latLng, 50, function(streetViewPanoramaData, status) {
          if (status === google.maps.StreetViewStatus.OK) {
            vm.hasStreetView = true;
          } else {
            vm.hasStreetView = false;
          }
        });
      }
    }

    function getCoordinates(location){
      var address;
      var coordinates;

      if(location.addressLine2) {
        address = encodeURIComponent(location.addressLine1 + ',' + location.addressLine2);
      } else {
        address = encodeURIComponent(location.addressLine1);
      }

      if(location.hasOwnProperty('locality') && location.hasOwnProperty('regionCode')) {
        coordinates = address + '+' +  location.locality + '+' + location.regionCode + '+'  +  location.postalCode + '+' + location.countryCode;
      } else {
        coordinates = address + '+' + location.city + '+' + location.stateCode + '+' +  location.postalCode + '+' + location.countryCode;
      }
      return coordinates;
    }

  });

  GoogleMapsModule.directive('easeGoogleMap', function() {
    return {
      restrict: 'AE',
      bindToController: true,
      controller: 'mapController',
      controllerAs : 'mapVM',
      scope : {
        merchant : '=',
        location : '=',
        load : '='
      },
      template : '<span data-ng-if="mapVM.location" class="map-container"><img ui-sref="map({merchant:mapVM.merchant, location:mapVM.location})" data-ng-src={{mapVM.getMapUri(mapVM.location)}}></span>'
    }
  });

  return GoogleMapsModule;

});
