define(['angular'], function(angular) {
  'use strict';

  var CONSTANTS = {
    BASE_URL: './ease-ui/bower_components/Debit/ver01.01.01.259',

    /*
    4000 - Checking
    4300 - Money
    4600 - TCC
    */
    CARD_STYLE_CODES: {
      reissue: {
        '4000': '043-395',
        '4300': '043-398'
        // '4600': '054-984'
      },
      reorder: {
        '4000': '043-394',
        '4300': '043-397'
        // '4600': '054-984'
      }
    },

    CHALLENGER_URL: {
      HOST: {
        NONPROD: 'https://cids-st-ext-ew.clouddqtext.',
        PROD : 'https://verified.'
      },
      URL : 'capitalone.com/challenge.html'
    }
  };

  angular
    .module('DebitModule')
    .constant('debitConstants', CONSTANTS);
});
