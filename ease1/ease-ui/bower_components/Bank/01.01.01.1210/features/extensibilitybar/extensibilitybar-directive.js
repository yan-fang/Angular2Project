define(['angular'], function(angular) {
        'use strict';

        angular
            .module('BankModule')
            .directive('extensibilitybar', function(BankFiles) {
                return {
                    restrict: 'E',
                    replace: false,
                    controller: 'BankExtensibilityBarController',
                    controllerAs: 'bankextensbar',
                    templateUrl: BankFiles.getFilePath('features/extensibilitybar/extensibilitybar-template.html')
                }; //end return
            })

    } //end define module function
); //end define
