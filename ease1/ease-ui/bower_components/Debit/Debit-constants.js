define(['angular'], function(angular) {
  'use strict';

  var CONSTANTS = {
    BASE_URL: './ease-ui/bower_components/Debit/@@version',
    COMMANDS: {
      ACTIVATE: 'activate',
      DEACTIVATE: 'deactivate',
      LOCK: 'lock',
      UNLOCK: 'unlock',
      REISSUE: 'reissueCard'
    },

    /*
    4000 - Checking
    4300 - Money
    4600 - TCC
    */
    CARD_STYLE_CODES: {
      '4000': '043-394',
      '4300': '043-398',
      '4600': '043-395'
    }
  };

  angular
    .module('DebitModule')
    .constant('debitConstants', CONSTANTS);
});
