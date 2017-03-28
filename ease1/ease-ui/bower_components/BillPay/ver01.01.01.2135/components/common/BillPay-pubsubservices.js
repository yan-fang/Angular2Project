'use strict';

define(['angular'], function(angular) {

  angular
      .module('BillPayModule')
      .factory('BillPayPubSubFactory', BillPayPubSubFactory)
      .constant('PubSubBillPayPageViewMap', {
        'billPayCenter': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'bill pay center'
          }
        },

        // One Time Make Payment
        'oneTimePaymentLanding': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'one time'
          }
        },
        'oneTimePaymentDateSelection': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'one time',
            'level4': 'choose date'
          }
        },
        'oneTimePaymentConfirmation': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'one time',
            'level4': 'confirmation'
          }
        },

        // One Time Edit Payment
        'oneTimeEditPaymentLanding': {
          'levels': {
            'level2': 'edit payment',
            'level3': 'one time'
          }
        },
        'oneTimeEditPaymentDateSelection': {
          'levels': {
            'level2': 'edit payment',
            'level3': 'one time',
            'level4': 'choose date'
          }
        },
        'oneTimeEditPaymentConfirmation': {
          'levels': {
            'level2': 'edit payment',
            'level3': 'one time',
            'level4': 'confirmation'
          }
        },

        // One Time Cancel Payment
        'oneTimeCancelPaymentLanding': {
          'levels': {
            'level2': 'cancel payment',
            'level3': 'one time'
          }
        },
        'oneTimeCancelPaymentConfirmation': {
          'levels': {
            'level2': 'cancel payment',
            'level3': 'one time',
            'level4': 'confirmation'
          }
        },

        // bank account detail
        'bankAccountDetail': {
          'levels': {
            'level2': 'account details',
            'level3': '',
            'level4': ''
          }
        },

        // Search Payee
        'searchPayee': {
          'levels': {
            'level2': 'bill pay',
            'level3': 'search payee',
            'level4': ''
          }
        },
        'searchPayeeAddPayeeInfo': {
          'levels': {
            'level2': 'bill pay',
            'level3': 'add searched payee info',
            'level4': ''
          }
        },
        'searchPayeeConfirmation': {
          'levels': {
            'level2': 'bill pay',
            'level3': 'searched payee confirmation',
            'level4': ''
          }
        },

        // Delete Payee
        'deletePayeeLanding': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'delete payee',
            'level4': ''
          }
        },
        'deletePayeeConfirmation': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'delete payee',
            'level4': 'confirmation'
          }
        },

        //Manual Add Payee

        'manualAddPayeeAccountNumberRequired': {
          'levels': {
            'level2': 'bill pay',
            'level3': 'account number requirement',
            'level4': ''
          }
        },
        'manualAddPayeeInfo': {
          'levels': {
            'level2': 'bill pay',
            'level3': 'add manual payee info',
            'level4': ''
          }
        },
        'manualAddPayeeAddress': {
          'levels': {
            'level2': 'bill pay',
            'level3': 'add payee address',
            'level4': ''
          }
        },
        'manualAddPayeeConfirmation': {
          'levels': {
            'level2': 'bill pay',
            'level3': 'manual payee confirmation',
            'level4': ''
          }
        },

        //Edit managed payee

        'editManagedPayeeLanding': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'edit managed payee',
            'level4': ''
          }
        },
        'editManagedPayeeConfirmation': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'edit managed payee',
            'level4': 'confirmation'
          }
        },
        'editManualPayeeLanding': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'edit manual payee',
            'level4': ''
          }
        },
        'editManualPayeeConfirmation': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'edit manual payee',
            'level4': 'confirmation'
          }
        },

        // recurring payment
        'recurringOnLoad': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'recurring',
            'level4': ''
          }
        },
        'recurringEndCalendar': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'recurring',
            'level4': 'end payments date'
          }
        },
        'recurringEndPaymentsReview': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'recurring',
            'level4': 'end payments date',
            'level5': 'confirmation'
          }
        },
        'recurringEndAfterXPayment': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'recurring',
            'level4': 'end payments time'
          }
        },
        'recurringSuccess': {
          'levels': {
            'level2': 'pay bill',
            'level3': 'recurring',
            'level4': 'confirmation'
          }
        },

        //CANCEL RECURRING PAYMENT

        'cancelRecurringOnLoad': {
          'levels': {
            'level2': 'cancel payment',
            'level3': 'recurring'
          }
        },
        'cancelAllRecurringSuccess': {
          'levels': {
            'level2': 'cancel payment',
            'level3': 'recurring',
            'level4': 'confirmation',
            'level5': 'all payments'
          }
        },
        'cancelSingleRecurringSuccess': {
          'levels': {
            'level2': 'cancel payment',
            'level3': 'recurring',
            'level4': 'confirmation',
            'level5': 'current payment'
          }
        }

      });


  //----------------------------------- Pub Sub Factory --------------------------------------------------------

  BillPayPubSubFactory.$inject = ['pubsubService', 'PubSubBillPayPageViewMap'];
  function BillPayPubSubFactory(pubsubService, PubSubBillPayPageViewMap) {


    var PubSubFactory = {
      logTrackAnalyticsPageView : logTrackAnalyticsPageView,
      logChangeEvent : logChangeEvent
    };

    return PubSubFactory;

    /**
     * Logs a page view to the new trackAnalytics pubsub queue for 360/Retails.
     *
     * @public
     * @method logTrackAnalyticsPageView
     *
     * @param {Object} data  Data to be mixed in to the 'taxonomy' property
     */
    function logTrackAnalyticsPageView(accountSubCategory, viewName) {
      var data = PubSubBillPayPageViewMap[viewName].levels;
      var lob = accountSubCategory || '360'

      pubsubService.pubsubTrackAnalytics({
        taxonomy: _.assign({
          level1: 'ease',
          level2: '',
          level3: '',
          level4: '',
          level5: '',
          country: 'us',
          language: 'english',
          system: 'ease_web'
        }, data),
        lob: lob
      });
    }

    /**
     * Logs a click to the new trackAnalytics pubsub queue.
     *
     * @public
     * @method logTrackAnalyticsClick
     *
     * @param {String} name  The name of the event to track
     *(e.g. name : "360:pay from change:dropdown" or "360:payment date change:button")
     */
    function logChangeEvent(name) {
      pubsubService.pubsubTrackAnalytics({
        name: name
      });
    }

  }


});
