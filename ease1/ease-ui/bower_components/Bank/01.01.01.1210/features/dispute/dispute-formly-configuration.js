define(['angular'], function(angular) {
  'use strict';
  angular
      .module('BankModule')
      .factory('DisputeFormlyFactory', DisputeFormlyFactory);

  DisputeFormlyFactory.$inject = ['$locale', 'DisputeFormlyUtil'];
  function DisputeFormlyFactory($locale, DisputeFormlyUtil) {

    return {
      getFormlyConfig : DisputeFormlyUtil.getFormlyConfig,
      initFormlyConfiguration : initFormlyConfiguration,
      resetModels : DisputeFormlyUtil.resetModels,
      setJointAccountProperties : setJointAccountProperties
    };

    function initFormlyConfiguration() {
      return DisputeFormlyUtil.initFormlyConfiguration('utils/i18n/formly/disputes-locale_en-us.json').then(function(data) {
        DisputeFormlyUtil.setFormlyConfig(data);
      });
    }

    function setJointAccountProperties(cardHolder) {
      var singleOrJoint = cardHolder.type;
      var templateOptions;
      if(DisputeFormlyUtil.getFormlyConfig()) {
        templateOptions = DisputeFormlyUtil.getFormlyConfig().fields.PRODUCTNOTRECEIVED[3].templateOptions;
      }
      if(singleOrJoint === 'joint') {
        templateOptions.label = templateOptions.extra.jointLabel.prefix +  cardHolder.firstName + templateOptions.extra.jointLabel.suffix;
      }
    }
  }
});
