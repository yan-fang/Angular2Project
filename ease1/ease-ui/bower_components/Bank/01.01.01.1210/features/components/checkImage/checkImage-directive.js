define(['angular'], function (angular) {
  'use strict';

  angular
      .module('BankModule')
      .controller('checkImageController', checkImageController)
      .directive('checkImage', checkImageDirective);

  checkImageController.$inject = ['BankPubSubFactory', 'BankFiles'];
  function checkImageController(BankPubSubFactory) {
    var vm = this;

    var properties = {
      displayImage : vm.checkFront,
      imageToggle : initToggle(vm.toggle),
      frontSelected : true
    };

    angular.extend(vm, {
      properties : properties,
      setDisplayImage: setDisplayImage
    });

    function initToggle(inputToggle){
      var toggle = {
        display : false,
        frontText : 'Front of Check',
        backText : 'Back of Check'      
      };

      if(!inputToggle) {
        return toggle;
      }

      if(inputToggle.display) {
        toggle.display = inputToggle.display;
      }
      if(inputToggle.frontText) {
        toggle.frontText = inputToggle.frontText;
      }
      if(inputToggle.backText) {
        toggle.backText = inputToggle.backText;
      }

      return toggle;
    }


    function setDisplayImage(newImage, eventName) {
      BankPubSubFactory.logButtonClickEvent(eventName);
      properties.displayImage = newImage;
      vm.properties.frontSelected = (eventName === 'front_of_check_deposit');
    }
  }

  checkImageDirective.$inject = ['BankFiles'];
  function checkImageDirective(BankFiles) {
    return {
      restrict : 'EA',
      controller : "checkImageController",
      controllerAs: "checkImageVM",
      bindToController: true,
      scope : {
        checkFront : '=',
        checkBack : '=',
        toggle : '=',
        parentId : '=?'
      },
      templateUrl: BankFiles.getFilePath('features/components/checkImage/checkImage.html')
    }
  }

});
