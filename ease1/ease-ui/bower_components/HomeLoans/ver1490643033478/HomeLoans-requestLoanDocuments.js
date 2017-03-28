define(['angular'], function(angular) {
  'use strict';

  angular.module('HomeLoansModule')
    .factory('requestDocumentsService', function() {
      return  {
        borrowerDetail : function(accountDetailsData) {
          var borrowerInfo ={};
          if(accountDetailsData.borrowerInfo) {
            var borrowerEntries = accountDetailsData.borrowerInfo.entries;
            borrowerInfo.address = borrowerEntries[0].addressDetails[0].address;
            borrowerInfo.name = borrowerEntries[0].firstName + " " +borrowerEntries[0].lastName;
          }
          return borrowerInfo;

        }


      };
    })
    .controller('RequestLoanDocumentsL2Controller', RequestLoanDocumentsL2Controller)
    .controller('RequestLoanDocumentSuccessController', RequestLoanDocumentSuccessController);

  RequestLoanDocumentsL2Controller.$inject = ['$scope', 'accountDetailsData', 'data', '$state', 'homeLoansAccountDetailsService', 'HomeLoansUtils','requestDocumentsService'];
  function RequestLoanDocumentsL2Controller($scope, accountDetailsData, data, $state, homeLoansAccountDetailsService, homeLoansUtils,requestDocumentsService) {

    var vm = this;
    var i18n = $scope.i18nHL;


    vm.documentTypes = data.requestDoc;

    vm.deliveryOption = '';
    var borrowerInfo = requestDocumentsService.borrowerDetail(accountDetailsData);

    if(borrowerInfo.address) {
      vm.name = borrowerInfo.name;
      vm.addressline1 = borrowerInfo.address.addressLine1;
      vm.addressline2 = borrowerInfo.address.addressLine2;
      vm.city = borrowerInfo.address.city;
      vm._place = borrowerInfo.address.stateCode;
      vm.zip = borrowerInfo.address.postalCode;
      // vm.attn = borrowerInfo.name;
    } else {
      vm.name = '';
      vm.addressline1 = '';
      vm.addressline2 = '';
      vm.city = '';
      vm._place = '';
      vm.zip = '';
     // vm.attn = borrowerInfo.name;
    }

    vm.attn = '';
    vm.company = '';
    vm.phNum = '';
    vm.addressType='mailingAddress';
    vm.mailingAddresslbl = 'mailingAddress';

    vm.fax ='';
    vm.validationErrorMessage = '';
    vm.cityStateZipMsg ='';
    vm.showDocumentError = false;
    vm.addressline1Error='';
    vm.cityStateZipError='';
    vm.showAddressError = false;
    vm.showCityStateZipError = false;
    vm.showFaxError = false;
    vm.showAttnError = false;
    vm.showNameError = false;

    angular.extend(vm, {
      focusClass:'selectAll',
      initClose: false,
      modalType: 'requestLoanDocuments',
      modalClass: 'icon-bills',
      close: function(){
        $state.go('^');
      },
      dateFormat: 'MMMM dd, yyyy',
      accountDetails: accountDetailsData.accountDetails,



      createServicingRequest: function(docString) {

        var servicingNotes = 'Customer requested ' + docString;

        servicingNotes = servicingNotes + ' for delivery ';
        if(vm.deliveryOption == 'mail') {

          servicingNotes = servicingNotes + "by mail to: " + vm.name;
          servicingNotes = servicingNotes + ", " + vm.addressline1;
          if(vm.addressline2) {
            servicingNotes = servicingNotes + ", " + vm.addressline2;
          }
          servicingNotes = servicingNotes + ", " + vm.city;
          servicingNotes = servicingNotes + " " + vm._place;
          servicingNotes = servicingNotes + ", " + vm.zip;

        } else {

          servicingNotes = servicingNotes + "by fax. Attention to: " + vm.attn;

          servicingNotes = servicingNotes + " Fax to: " + vm.fax;

          if(vm.company) {
            servicingNotes = servicingNotes + ", " + vm.company;
          }
          if(vm.phNum) {
            servicingNotes = servicingNotes + ", " + vm.phNum;
          }
        }

        console.log(servicingNotes);
        var servicingRequest = {
          "taskCode" : "EASEDC" ,
          "agentAuthoredServicingNotes" : servicingNotes
        }

        return servicingRequest;


      },

      documentRequestSuccess: function() {
        return function(data) {

          var checkedDocs = vm.documentTypes.group1.filter(function(value) {
              return value.checked;
          });

          for(var docType in vm.documentTypes.group2) {
            if(vm.documentTypes.group2[docType].checked == true) {
              checkedDocs[checkedDocs.length] = vm.documentTypes.group2[docType];
            }
          }

          for(var docType in vm.documentTypes.group3) {
            if(vm.documentTypes.group3[docType].checked == true) {
              checkedDocs[checkedDocs.length] = vm.documentTypes.group3[docType];
            }
          }

          var toParams = {
            requestedDocs: checkedDocs,
            deliveryType: vm.deliveryOption,
            addressInfo: {
              name: vm.name,
              addressLine1: vm.addressline1,
              addressLine2: vm.addressline2,
              cityStateZip: vm.city + ", " + vm._place + " " + vm.zip
            },
            faxInfo: {
              faxNumber: vm.fax,
              attention: vm.attn,
              companyDept: vm.company,
              phoneNumber: vm.phNum
            }
          };
          vm.loadingButtonClass1 = '';
          vm.loadingButtonClass2 = '';
          $state.go('HomeLoansDetails.transactions.requestDocumentSuccess', toParams);

          console.log("Document Request Success");
        }
      },

      documentRequestFailed: function() {
        return function(data) {
          vm.loadingButtonClass1 = '';
          vm.loadingButtonClass2 = '';
          console.log("Document Request Failed");
        }
      },

      docTypeSelected: function(compId) {

        if(vm.documentTypes[compId].checked == true) {
          vm.showDocumentError = false;
        }

      },

      errorField : function(formElement) {

        var field = document.getElementById(formElement);


        field.setAttribute("aria-invalid", "true");
        field.setAttribute("class", "invalid");

        if(formElement == 'checkbox-amCalc') {
          field.setAttribute("aria-describedby","selectionValidationId");
        }
        if(formElement === 'addressline1') {
          field.setAttribute("aria-describedby","addressline1ErrorMsg");
        }
        if(formElement === 'nameId') {
          field.setAttribute("aria-describedby","nameIdErrorMsg");
        }
        if(formElement === 'citylbl' || formElement === 'statelbl' || formElement === 'zipCodelbl') {
          field.setAttribute("aria-describedby","cityStateZipErrorId");
        }

        if(formElement === 'faxNumber') {
          field.setAttribute("aria-describedby","faxNumberErrorId");
        }

        if(formElement === 'attentionId') {
          field.setAttribute("aria-describedby","nameIdErrorMsg");
        }

      },

      requestFocus : function(formElement) {
        var field =  document.getElementById(formElement);
        field.focus();

      },

      resetErrorField : function(formElement) {

        var field = document.getElementById(formElement);
        field.setAttribute("aria-invalid", "false");
        field.setAttribute("class", "ng-pristine ng-valid ng-touched");

        if(formElement === 'addressline1') {
          vm.showAddressError = false;
        }
        if(formElement === 'nameId') {
          vm.showNameError = false;
        }
        if(formElement === 'citylbl' || formElement === 'statelbl' || formElement === 'zipCodelbl') {
          vm.showCityStateZipError = false;
        }

        if(formElement === 'faxNumber') {
          vm.showFaxError = false;
        }
        if(formElement === 'attentionId') {
          vm.showAttnError = false;
        }
      },

      deliveryOptionToggle : function(name) {

        if(name == 'mail') {
          vm.resetErrorField('addressline1');
          vm.resetErrorField('nameId');
          vm.resetErrorField('citylbl');
          vm.resetErrorField('statelbl');
          vm.resetErrorField('zipCodelbl');
        }

        if(name == 'fax') {
          vm.resetErrorField('faxNumber');
          vm.resetErrorField('attentionId');
        }

        vm.showDocumentError = false;
        vm.loadingButtonClass1 ='';
        vm.loadingButtonClass2 = '';
      },

      addressToggle : function(name) {

        if(name == 'thirdPartyAddress') {
          vm.name = '';
          vm.addressline1 = '';
          vm.addressline2 = '';
          vm.city = '';
          vm._place = '';
          vm.zip = '';
          vm.mailingAddresslbl = 'thirdPartyAddress';
        }

        if(name == 'mailingAddress' && borrowerInfo.address ) {
          vm.addressline1 = borrowerInfo.address.addressLine1;
          vm.addressline2 = borrowerInfo.address.addressLine2;
          vm.city = borrowerInfo.address.city;
          vm._place = borrowerInfo.address.stateCode;
          vm.zip = borrowerInfo.address.postalCode;
          vm.mailingAddresslbl = 'mailingAddress';
          vm.name = borrowerInfo.name;

        }
        vm.resetErrorField('addressline1');
        vm.resetErrorField('nameId');
        vm.resetErrorField('citylbl');
        vm.resetErrorField('statelbl');
        vm.resetErrorField('zipCodelbl');
        vm.resetErrorField('faxNumber');
        vm.resetErrorField('attentionId');
        vm.showDocumentError = false;

      },



      validateForm : function() {
        var isValid = true;
        var focusSet = false;
        //check if one document type is selected
        var isDocTypeSelected = false;
        for(var docType in vm.documentTypes.group1) {
          if(!isDocTypeSelected) {
            if (vm.documentTypes.group1[docType].checked === true) {
              isDocTypeSelected = true;

            }
          }
        }
        for(var docType in vm.documentTypes.group2) {
          if(!isDocTypeSelected) {
            if (vm.documentTypes.group2[docType].checked === true) {
              isDocTypeSelected = true;

            }
          }
        }
        for(var docType in vm.documentTypes.group3) {
          if(!isDocTypeSelected) {
            if (vm.documentTypes.group3[docType].checked === true) {
              isDocTypeSelected = true;

            }
          }
        }
        if(!isDocTypeSelected) {
          vm.showDocumentError = true;
          isValid = false;
          if (!focusSet) {
            vm.errorField('0');
            vm.requestFocus('0');
            focusSet = true;
          }
        }
        //check mandatory field
        if(vm.deliveryOption === 'mail') {

          if(angular.isUndefined(vm.name) || vm.name.trim() =="") {
            vm.errorField('nameId');
            vm.nameMissing = i18n.requestDocuments.nameMissing;
            vm.showNameError = true;
            isValid = false;
            if (!focusSet) {
              vm.requestFocus('nameId')
              focusSet = true;
            }
          } else {
            //vm.showNameError = false;
            vm.resetErrorField('nameId');
          }

          if(angular.isUndefined(vm.addressline1) || vm.addressline1.trim() =="") {
            vm.errorField('addressline1');
            vm.addressline1Error = i18n.requestDocuments.addressline1Missing;
            vm.showAddressError = true;
            isValid = false;
            if (!focusSet) {
              vm.requestFocus('addressline1')
              focusSet = true;
            }
          } else {
            //vm.showAddressError = false;
            vm.resetErrorField('addressline1');
          }

          vm.showCityStateZipError = false;
          vm.cityStateZipMsg = i18n.requestDocuments.pleaseEnter;

          if(angular.isUndefined(vm.city) || vm.city.trim() == "") {
            isValid = false;
            vm.errorField('citylbl');
            if (!focusSet) {
              vm.requestFocus('citylbl')
              focusSet = true;
            }
            vm.cityStateZipMsg = vm.cityStateZipMsg + i18n.requestDocuments.city +" ";
            vm.showCityStateZipError = true;


          }else {
            //vm.showAddressError = false;
            vm.resetErrorField('citylbl');
          }

          var stateRegex = /^[a-zA-Z]{2}$/;

          if(angular.isUndefined(vm._place) || vm._place.trim() == "" || !vm._place.match(stateRegex))
          {
            isValid = false;
            if(vm.showCityStateZipError) {
              vm.cityStateZipMsg = vm.cityStateZipMsg + ", "
            }
            vm.cityStateZipMsg = vm.cityStateZipMsg + i18n.requestDocuments.state + " ";
            vm.errorField('statelbl');
            if (!focusSet) {
              vm.requestFocus('statelbl')
              focusSet = true;
            }
            vm.showCityStateZipError = true;
          }else {
            //vm.showAddressError = false;
            vm.resetErrorField('statelbl');
          }

          var zipRegex = /^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] *\d[A-Z]\d)$/;

          if(angular.isUndefined(vm.zip) || vm.zip.trim() =="" || !vm.zip.match(zipRegex)) {
            isValid = false;
            vm.errorField('zipCodelbl');
            if (!focusSet) {
              vm.requestFocus('zipCodelbl')
              focusSet = true;
            }
            if(vm.showCityStateZipError) {
              vm.cityStateZipMsg = vm.cityStateZipMsg + ", "
            }
            vm.cityStateZipMsg = vm.cityStateZipMsg + i18n.requestDocuments.zipCode + " ";
            vm.showCityStateZipError = true;
          }else {
            //vm.showAddressError = false;
            vm.resetErrorField('zipCodelbl');
          }

          if (!vm.showCityStateZipError) {
            vm.showCityStateZipError = false;

          }
        }

        if(vm.deliveryOption === 'fax') {

          if(angular.isUndefined(vm.fax) || vm.fax.trim() == "") {
            isValid = false;
            vm.errorField('faxNumber');
            if (!focusSet) {
              vm.requestFocus('faxNumber')
              focusSet = true;
            }
            vm.cityStateZipMsg = i18n.requestDocuments.pleaseEnter + i18n.requestDocuments.faxNumber + " ";
            vm.showFaxError = true;
          } else {
            vm.showFaxError = false;
          }

          if(angular.isUndefined(vm.attn) || vm.attn.trim() == "") {
            vm.errorField('attentionId');

            isValid = false;
            if (!focusSet) {
              vm.requestFocus('attentionId')
              focusSet = true;
            }

            vm.attentionMissing = i18n.requestDocuments.nameMissing;
            vm.showAttnError = true;

          } else {
            vm.resetErrorField('attentionId');
            vm.showAttnError = false;
          }


        }

        return isValid;
      },

      //logic to execute request button event.
      requestDocs: function(buttonName) {

        var selectedDocs = requestButtonAnalytics();

        //Replace pipes with comma as MSP expects.
        var mspDocString = selectedDocs.replace(/ \|/g, ',');

        if(vm.validateForm()) {
          if(buttonName == "loadingButtonClass1"){
            vm.loadingButtonClass1 = 'loading';
          }else if(buttonName == "loadingButtonClass2"){
            vm.loadingButtonClass2 = 'loading';
          }
          var servicingRequest = vm.createServicingRequest(mspDocString);
          console.log(servicingRequest);
          homeLoansAccountDetailsService.submitDocumentRequest(accountDetailsData.accountReferenceId, servicingRequest).then(vm.documentRequestSuccess(), vm.documentRequestFailed());
        } else {
          console.log("Validation failed");
        }
      },

      //select all check box irrespective of previous selection
      selectAll: function() {
        for(var docType in vm.documentTypes.group1) {
          vm.documentTypes.group1[docType].checked = true;
        }

        for(var docType in vm.documentTypes.group2) {
          vm.documentTypes.group2[docType].checked = true;
        }

        for(var docType in vm.documentTypes.group3) {
          vm.documentTypes.group3[docType].checked = true;
        }
        vm.showDocumentError = false;
      },

      //de-select all checkbox irrespective of previous selection
      unselectAll: function() {
        for(var docType in vm.documentTypes.group1) {
          vm.documentTypes.group1[docType].checked = false;
        }
        for(var docType in vm.documentTypes.group2) {
          vm.documentTypes.group2[docType].checked = false;
        }
        for(var docType in vm.documentTypes.group3) {
          vm.documentTypes.group3[docType].checked = false;
        }
      }


    });

    var stringifyDocuments = function(documents, delimiter) {

      var docString = '';
      angular.forEach(documents.group1, function(value, key){
        if(value.checked)
          docString = docString + " " + value.name + delimiter;
      });
      angular.forEach(documents.group2, function(value, key){
        if(value.checked)
          docString = docString + " " + value.name + delimiter;
      });
      angular.forEach(documents.group3, function(value, key){
        if(value.checked)
          docString = docString + " " + value.name + delimiter;
      });
      docString = docString.substring(0, docString.length - delimiter.length);
      docString = docString.trim();

      return docString;
    }

    //Analytics for Site Catalyst.
    var requestButtonAnalytics = function() {

      var selectionAnalytics = stringifyDocuments(vm.documentTypes, ' |');

      var deliveryMethod = vm.deliveryOption;
      if (deliveryMethod === 'mail') {
        if(vm.addressType === 'mailingAddress') {
          deliveryMethod += " | " + i18n.requestDocuments.mailingAddressLbl;
        }
        else {
          deliveryMethod += " | " + i18n.requestDocuments.thirdPartyAddressLbl;
        }
      }

      homeLoansUtils.buttonAnalytics({
        name: 'request documents',
        accountAction: selectionAnalytics,
        selection: deliveryMethod
      });

      return selectionAnalytics;
    }

  }

  RequestLoanDocumentSuccessController.$inject = ['$scope', 'accountDetailsData', '$state', '$stateParams','HomeLoansUtils'];
  function RequestLoanDocumentSuccessController($scope, accountDetailsData, $state, $stateParams,homeLoansUtils) {

    var vm = this;

    angular.extend(vm, {
      focusClass      : 'selectAll',
      initClose       : false,
      modalType       : 'requestLoanDocumentsSuccess',
      modalClass      : 'icon-check',
      i18n            : $scope.i18nHL.requestDocuments,
      last4AccountNum : accountDetailsData.accountDetails.accountNumber.substr(accountDetailsData.accountDetails.accountNumber.length - 4),
      requestedDocs   : $stateParams.requestedDocs,
      deliveryType    : $stateParams.deliveryType,
      addressInfo     : $stateParams.addressInfo,
      faxInfo         : $stateParams.faxInfo,
      deliveredToLabel: homeLoansUtils.formTheMessage($stateParams.addressInfo, $stateParams.faxInfo,$scope.i18nHL.requestDocuments),
      documentsDeliveredLabel: homeLoansUtils.listDocuments($stateParams.requestedDocs,$scope.i18nHL.requestDocuments),
      close           : function () {
        $state.go('^');
      }
    });
  }

});
