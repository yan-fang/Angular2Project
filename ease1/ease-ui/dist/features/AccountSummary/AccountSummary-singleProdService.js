define(['angular'], function(angular) {
  'use strict';

  var summarySingleProd = angular.module('summaryModule');
  summarySingleProd.factory('SingleProdService', singleProdService);

  function addAttrTransaction(oldItem, oldAttr, newItem, newAttr, defaultValue) {
    if (oldItem && typeof oldAttr === 'string' && oldItem[oldAttr]) {
      newItem[newAttr] = oldItem[oldAttr];
    } else if (typeof oldAttr === 'object' && oldAttr.length > 0) {
      for (var i = 0; i < oldAttr.length; i++) {
        if (oldItem[oldAttr[i]]) {
          newItem[newAttr] = oldItem[oldAttr[i]];
          break;
        }
      }
    } else {
      if (defaultValue) {
        newItem[newAttr] = defaultValue;
      }
    }
  }

  function singleProdService($q, Restangular, EaseConstantFactory, EaseConstant, easeExceptionsService, EASEUtilsFactory) {
    return {
      getSingleProductViewData: function(urlParams, accountDetailsRefId) {
        return this.getAccountDetailData(urlParams, accountDetailsRefId);
      },

      getAccountDetailData: function(urlParams, accountDetailsRefId) {
        var me = this;
        var deferred = $q.defer();
        var transactions = null;

        if (typeof urlParams.next === 'undefined') {
          urlParams.next = 0;
        }
        if (typeof urlParams.filter === 'undefined') {
          urlParams.filter = EaseConstant.kBaseSetTransactions;
        }
        //For now, type refers to either transactions or details, once the product page expands, then it can go
        //into other categories
        if (typeof urlParams.type === 'undefined') {
          urlParams.type = '/';
        }
        var url = EASEUtilsFactory.createAccountDetailUrl(urlParams, encodeURIComponent(accountDetailsRefId));
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        transactions = Restangular.all(url);
        transactions.get('').then(function(data) {
          EASEUtilsFactory.IsFooterDisplaySet(false);
          data['accountRefId'] = accountDetailsRefId;
          deferred.resolve(data);
        }, function(ex) {
          deferred.reject();
          throw easeExceptionsService.createEaseException({
            'module': 'easeutils',
            'function': 'getAccountDetailData',
            'message': ex.statusText,
            'cause': ex
          });

        });
        return deferred.promise;
      },
      formatDataForSingleProdView: function(data, productCategory, i18n) {
        var transactions = [];

        if (productCategory === 'CD') {
          if (typeof data.transactions.scheduled !== 'undefined') {
            transactions.push.apply(transactions, addGlobalAttributeToObject(data.transactions.scheduled,
              'transactionState', 'scheduled'));
          }

          if (typeof data.transactions.pending !== 'undefined') {
            transactions.push.apply(transactions, addGlobalAttributeToObject(data.transactions.pending,
              'transactionState', 'pending'));
          }
          if (typeof data.transactions.entries !== 'undefined') {
            transactions.push.apply(transactions, addGlobalAttributeToObject(data.transactions.entries,
              'transactionState', 'posted'));
          }
          if (typeof data.transactions.posted !== 'undefined') {
            transactions.push.apply(transactions, addGlobalAttributeToObject(data.transactions.posted,
              'transactionState', 'posted'));
          }

        } else {
          transactions = data;
        }

        if (transactions.length > 0) {
          //TO DO when the json will be safer remove the formating of the transaction
          var converDate = function(str) {
            return new Date(str);
          };
          var sortTransaction = function(a, b) {
            return new converDate(b.transactionDate).getTime() - new converDate(a.transactionDate).getTime();
          };

          if (productCategory === 'DDA' || productCategory === 'SA' || productCategory === 'MMA' ||
            productCategory === 'CC' ||
            productCategory === 'AL' || productCategory === 'HLC' || productCategory === 'HIL' ||
            productCategory === 'MLA' ||
            productCategory === 'ILA') {
            var tempTrans = this.structureTransactionJson(transactions, productCategory, i18n).splice(0, 5);
          } else {
            var tempTrans = this.structureTransactionJson(transactions, productCategory, i18n)
              .sort(sortTransaction).splice(0, 5);
          }

          var scheduledTrans = [];
          for (var i = 0; i <= tempTrans.length - 1; i++) {
            if (tempTrans[i].transactionState == 'Scheduled') {
              scheduledTrans.push(tempTrans[i]);
              tempTrans.splice(i, 1);
              i--;
            }
          }


          scheduledTrans = EASEUtilsFactory.mapSort(scheduledTrans, 'transactionDate', false);
          tempTrans = scheduledTrans.concat(tempTrans);

          if (productCategory === 'CD') {
            var returnTransaction = {};
            for (var i = 0; i < tempTrans.length; i++) {
              if (returnTransaction[tempTrans[i].transactionState.toLowerCase()] === undefined) {
                returnTransaction[tempTrans[i].transactionState.toLowerCase()] = [];
              }
              returnTransaction[tempTrans[i].transactionState.toLowerCase()].push(tempTrans[i]);
            }
            tempTrans = [];
            if (returnTransaction.scheduled) {
              tempTrans = tempTrans.concat(returnTransaction.scheduled);
            }
            if (returnTransaction.pending) {
              tempTrans = tempTrans.concat(returnTransaction.pending);
            }
            if (returnTransaction.posted) {
              tempTrans = tempTrans.concat(returnTransaction.posted);
            }
          }
          return tempTrans;
        }
        return transactions;
      },
      structureTransactionJson: function(data, productCategory, i18n) {
        var dataFormat = [];
        for (var i = 0; i < data.length; i++) {
          var oldItem = data[i];
          var newItem = {};
          var d = new Date();
          var defaulDate = d.toISOString();
          if (productCategory === 'CC') {
            addAttrTransaction(oldItem, 'displayDate', newItem, 'transactionDate');
            addAttrTransaction(oldItem, 'merchant', newItem, 'merchant');
            addAttrTransaction(oldItem, 'date', newItem, 'transactionDate');
            addAttrTransaction(oldItem, 'categoryIconURL', newItem, 'categoryIconURL');
            addAttrTransaction(oldItem, 'description', newItem, 'transactionDescription');
            addAttrTransaction(oldItem, 'amount', newItem, 'transactionAmount');
            if (newItem.transactionAmount < 0) {
              newItem.creditTransaction = 'creditTransaction';
            }
            newItem.transactionAmount = numeral(parseFloat(newItem.transactionAmount)).format(i18n.amountSymbol +
              '0,0.00');
            addAttrTransaction(oldItem, 'transactionState', newItem, 'transactionState');
          } else if (productCategory === 'AL') {
            addAttrTransaction(oldItem, 'merchant', newItem, 'merchant');
            addAttrTransaction(oldItem, 'date', newItem, 'transactionDate', defaulDate);
            addAttrTransaction(oldItem, 'categoryIconURL', newItem, 'categoryIconURL', '');
            addAttrTransaction(oldItem, 'transactionDescription', newItem, 'transactionDescription', 'N/A');
            addAttrTransaction(oldItem, 'transactionAmount', newItem, 'transactionAmount', '0');
            newItem.transactionAmount = numeral(parseFloat(newItem.transactionAmount)).format(i18n.amountSymbol +
              '0,0.00');
            addAttrTransaction(oldItem, 'transactionState', newItem, 'transactionState', 'N/A');
            addAttrTransaction(oldItem, 'transactionType', newItem, 'transactionType', 'N/A');
          } else if (productCategory === 'MLA' || productCategory === 'HLC' || productCategory === 'HIL') {
            if (!oldItem.showYear) {
              addAttrTransaction(oldItem, 'merchant', newItem, 'merchant');
              addAttrTransaction(oldItem, 'date', newItem, 'transactionDate', defaulDate);
              addAttrTransaction(oldItem, 'categoryIconURL', newItem, 'categoryIconURL', '');
              addAttrTransaction(oldItem, 'transactionDescription', newItem, 'transactionDescription', 'N/A');
              addAttrTransaction(oldItem, 'transactionAmount', newItem, 'transactionAmount', '0');
              newItem.transactionAmount = numeral(parseFloat(newItem.transactionAmount)).format(i18n.amountSymbol +
                '0,0.00')
                .replace(/-(.*)/, "($1)");
              addAttrTransaction(oldItem, 'transactionState', newItem, 'transactionState', 'N/A');
            }
          } else if (productCategory === 'ILA') {
            addAttrTransaction(oldItem, 'merchant', newItem, 'merchant');
            addAttrTransaction(oldItem, 'date', newItem, 'transactionDate', defaulDate);
            addAttrTransaction(oldItem, 'categoryIconURL', newItem, 'categoryIconURL', '');
            addAttrTransaction(oldItem, 'transactionDescription', newItem, 'transactionDescription', 'N/A');
            addAttrTransaction(oldItem, 'transactionAmount', newItem, 'transactionAmount', '0');
            newItem.transactionAmount = numeral(parseFloat(newItem.transactionAmount)).format(i18n.amountSymbol +
              '0,0.00');
            addAttrTransaction(oldItem, 'transactionState', newItem, 'transactionState', 'N/A');
          } else if (['DDA', 'DDA360', 'SA', 'SA360', 'CD', 'MMA'].indexOf(productCategory) !== -1) {
            addAttrTransaction(oldItem, 'merchant', newItem, 'merchant');
            addAttrTransaction(oldItem.transactionOverview, 'transactionDate', newItem, 'transactionDate',
              defaulDate);
            addAttrTransaction(oldItem.transactionIcon, 'href', newItem, 'categoryIconURL', '');
            addAttrTransaction(oldItem.transactionOverview, 'transactionTitle', newItem,
              'transactionDescription', 'N/A');
            addAttrTransaction(oldItem.transactionOverview, 'transactionAmount', newItem, 'transactionAmount',
              '0');
            if (oldItem.debitCardType) {
              newItem.debitCardType = oldItem.debitCardType;
              newItem.transactionAmount = oldItem.debitCardType.toLowerCase() === 'debit' ? numeral('-' +
                newItem.transactionAmount).format(i18n.amountSymbol + '0,0.00') : '+' +
              numeral(newItem.transactionAmount).format(i18n.amountSymbol + '0,0.00');
            } else {
              newItem.transactionAmount = '+' + numeral(newItem.transactionAmount).format(i18n.amountSymbol +
                  '0,0.00');
            }
            addAttrTransaction(oldItem, 'transactionState', newItem, 'transactionState', 'N/A');
          } else {
            addAttrTransaction(oldItem, 'merchant', newItem, 'merchant');
            addAttrTransaction(oldItem, 'transactionDate', newItem, 'transactionDate', defaulDate);
            addAttrTransaction(oldItem, 'categoryIconURL', newItem, 'categoryIconURL', '');
            addAttrTransaction(oldItem, 'transactionDescription', newItem, 'transactionDescription', 'N/A');
            addAttrTransaction(oldItem, 'transactionAmount', newItem, 'transactionAmount', '0');
            newItem.transactionAmount = numeral(parseFloat(newItem.transactionAmount)).format(i18n.amountSymbol +
              '0,0.00');
            addAttrTransaction(oldItem, 'transactionState', newItem, 'transactionState', 'N/A');
          }
          if (!_.isEmpty(newItem)) {
            dataFormat.push(newItem);
          }
        }
        return dataFormat;
      }
    }
  }
  singleProdService.$inject = ["$q", "Restangular", "EaseConstantFactory", "EaseConstant", "easeExceptionsService", "EASEUtilsFactory"];

  return summarySingleProd;
});
