define([], function() {

  var PATH_TO_HTML = '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/paperlessPreference/partials/' +
    'paperless-preference.component.html';

  PaperlessPreferenceComponentController.$inject = ['$sce'];
  function PaperlessPreferenceComponentController($sce) {
    var vm = this;
    vm.isDisabled = true;
    vm.updatePreference = function() {
      vm.isDisabled = !vm.isDisabled;
    };

    vm.isDisabled = function() {
      return vm.isDisabled;
    };
    vm.trustHtml = function(htmlCode, id) {
      htmlCode = htmlCode.replace('{0}', id);
      return $sce.trustAsHtml(htmlCode);
    };

  }

  function paperlessPreference() {
    return {

      restrict: 'E',
      scope: {
        id: '@',
        model: '=',
        i18n: '=',
        onSubmit: '&',
        onCancel: '&',
        errorMessage: '='
      },

      bindToController: true,
      controller: PaperlessPreferenceComponentController,
      controllerAs: 'ctrl',
      templateUrl: PATH_TO_HTML
    };
  }

  return paperlessPreference;
});

