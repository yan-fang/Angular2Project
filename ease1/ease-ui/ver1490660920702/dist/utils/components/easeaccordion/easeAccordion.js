define(['angular'], function (angular) {
  'use strict';

  angular
      .module('easeAccordion', [])
      .controller('accordionController', accordionController)
      .directive('easeAccordion', accordionDirective)
      .directive('accordionDrawer', accordionDrawerDirective)
      .directive('stopEventProp', stopEventPropDirective);

  function accordionController($scope, $window) {

    var vm = this, scrollWindow;
    var openIndices = [];

    angular.extend(vm, {
      getDrawerClass : getDrawerClass,
      isOpen: isOpen,
      setOpenIndex: setOpenIndex
    });

    //TODO: DEPRECATED If currently using, please use isOpen and directive high changes for opening and closing.
    function getDrawerClass(index) {
      if (isOpen(index)) {
        return "childOpen"
      }
    }
    function isOpen(testIndex) {
      return openIndices.indexOf(testIndex) > -1
    }

    function setOpenIndex(index) {
      //TODO: Revisit for possible optimization
      if(isOpen(index)) {
        var currentIndex = openIndices.indexOf(index);
        openIndices.splice(currentIndex, 1);
        return;
      }
      if (this.onlyOpenOne) {
        openIndices[0] = index;
      } else {
        openIndices.push(index);
      }
    }


    function closeDrawerOnScroll(){
       if(openIndices.length>0) {
         openIndices.splice(0, 1);
         $scope.$apply();
       }
    }

    if(this.closeOnScroll){
      scrollWindow = angular.element($window);
      scrollWindow.on('scroll', closeDrawerOnScroll);
      $scope.$on('$destroy', function(){
        scrollWindow.off('scroll', closeDrawerOnScroll);
      });
    }

  }
  accordionController.$inject = ["$scope", "$window"];

  function accordionDirective() {

    return {
      restrict: 'AE',
      bindToController: true,
      controller: 'accordionController',
      controllerAs: 'accordionVM',
      scope: {
        accordionElements: '=',
        onlyOpenOne: '=',
        closeOnScroll: '=',
        accordionParent: '='
      },
      templateUrl: function getTemplate($element, $attrs) {
        if ($attrs.templateOverride) {
          return $attrs.templateOverride;
        }
        return '/ease-ui/dist/partials/accordion.html';
      }
    };
  }

  accordionDrawerDirective.$inject = ['$parse', '$animate'];
  function accordionDrawerDirective($parse, $animate) {
    return{
      restrict: 'AE',
      link : function(scope, element, attr) {

        var stillOpen = false;
        var initialized = false;
        var accordionOpenCallback = $parse(attr.accordionOpen);
        var accordionCloseCallback = $parse(attr.accordionClose);

        scope.$watch(attr.isOpen, function(elementOpen){
          if(elementOpen) {
            stillOpen = true;
            openDrawer();
            accordionOpenCallback(scope);
          }
          else {
            closeDrawer();
            if(initialized) {
                accordionCloseCallback(scope);
            } else {
            	initialized = true;
            }
            stillOpen = false;
          }
        });

        function openDrawer() {

          var start = {height: 0};
          var end = {height: element[0].scrollHeight + 'px'};

          element
              .attr('aria-expanded', true)
              .attr('aria-hidden', false);

          $animate.animate(element, start, end).then(expandDone)

        }

        function expandDone() {
          element.css({height: 'auto'});
        }

        function closeDrawer() {
          if(stillOpen) {

            var start = {height: element[0].scrollHeight + 'px'};
            var end = {height: 0, animate: '0.75 linear'};

            element
                .attr('aria-expanded', false)
                .attr('aria-hidden', true);

            $animate.animate(element, start, end).then(collapseDone)
          }
        }

        function collapseDone() {
          element.css({height: '0'});
        }
      }
    }
  }

  function stopEventPropDirective() {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('click', function (e) {
          e.stopPropagation();
        });
      }
    }
  }

});

