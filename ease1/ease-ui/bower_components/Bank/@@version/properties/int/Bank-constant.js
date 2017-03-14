define(['angular'], function(angular) {
        'use strict';

        angular
            .module('BankModule')
            .constant('BankEnvironmentConstants', {
                mySavingsGoalsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/goaltracker',
                payBillsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/ummPaymentsOverview?stateId=displayUmmPaymentOverview&dnr=1',
                eStatementsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/estatements.vm',
                directbankDefaultUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/account_summary.vm',
                billPayOverview: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/ummPaymentsOverview',
                checkingTandCUrl: 'https://home-qa2.int.capitalone360qa.com/terms_360checking',
                savingTandCUrl: 'https://home-qa2.int.capitalone360qa.com/terms_360savings',
                tccTandCUrl: 'https://home-qa2.int.capitalone360qa.com/terms_totalcontrolchecking',
                csaTandCUrl: 'https://home-qa2.int.capitalone360qa.com/terms_confidencesavings',
                directMoneyTandCUrl: 'https://home-qa2.int.capitalone360qa.com/terms_360moneymarket',
                moneyTandCUrl: 'https://home-qa2.int.capitalone360qa.com/terms_money',
                ksaTandCUrl: 'https://home-qa2.int.capitalone360qa.com/terms_ksa',
                cdTandCUrl: 'https://home-qa2.int.capitalone360qa.com/terms_cd',
                iraSavingTandCUrl: 'https://home-qa2.int.capitalone360qa.com/terms_ira',
                iraCdTandCUrl: 'https://home-qa2.int.capitalone360qa.com/terms_ira',
                cdTruthInSavingDisclosure: 'https://secure-qa2.int.capitalone360qa.com/myaccount/plain/tisa_print.vm',
                retailBillpayUrl: 'https://olbrqa1.kdc.capitalone.com/olb-web/bill-pay-schedule',
                retailTandCUrl: 'https://olbrqa1.kdc.capitalone.com/olb-web/terms_conditions',
                retailIraTransferMoneyUrl: 'https://olbrqa1.kdc.capitalone.com/olb-web/container/transfers',
                retailMessageCenter: 'https://olbrqa1.kdc.capitalone.com/olb-web/messageCenter'
            })
            .constant('RetailMoreServicesConstants', {
                debitActivationUrl: 'https://olbrqa1.kdc.capitalone.com/olb-web/cardActivate',
                paperlessPreferencesUrl: 'https://olbrqa1.kdc.capitalone.com/olb-web/paperless-preferences'
            })
            .constant('BankMoreServicesEligibilityConstants', {
              3000 : ['savings', 'checkDeposit','directDeposit', 'automaticSavings', 'mobileDepositChecks'],
              3010 : ['savings', 'checkDeposit','directDeposit', 'automaticSavings','mobileDepositChecks'],
              3300 : ['savings', 'checkDeposit','directDeposit', 'automaticSavings','mobileDepositChecks'],
              3400 : ['savings', 'checkDeposit','directDeposit', 'automaticSavings','mobileDepositChecks'],
              3500 : [],
              4000 : ['debitActions','directDeposit', 'checkDeposit', 'transfers', 'overdraft', 'checks', 'p2p', 'billPay', 'paymentActivity', 'mobileDepositChecks'],
              4600 : ['debitActions','directDeposit', 'checkDeposit', 'transfers', 'overdraft', 'checks', 'p2p', 'billPay', 'paymentActivity', 'mobileDepositChecks'],
              4300 : ['debitActions','directDeposit', 'checkDeposit','mobileDepositChecks'],
              IRA3000 : ['savings','mobileDepositChecks'],
              IRA3500 : ['directDeposit', 'checkDeposit', 'transfers', 'automaticSavings','mobileDepositChecks']
            })
            .constant('BankMoreServicesConstants', {
                activationDefaultUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/account_summary.vm',
                pinManagementUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/changeCardPin?stateId=sendPin&dnr=1',
                lockDefaultUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/debitcard?execution=e3s2&stateId=deactivateStart&dnr=1',
                unlockDefaultUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/account_summary.vm',
                travelNotifyUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/accountDetailDebitCard?stateId=debitTabRender&dnr=1',
                externalAccountsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/externalLink?stateId=displayIndividualLinks&dnr=-1',
                accessCodeUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/account_summary.vm?td=accessCode',
                contactInfoUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/contactinfo?stateId=contactInfo&dnr=-1',
                signInInfoUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/signinoptions_sso.vm',
                privacyUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/privacy?stateId=viewPrivacy&dnr=-1',
                overdraftUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/accountDetailOverdraft?stateId=mainView&dnr=1',
                referAFriendUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/account_summary.vm?td=referAFriend',
                documentsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/accountDetailForms?stateId=accountDetailForms&dnr=1',
                statementsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/estatements.vm',
                taxFormsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/tax_forms_landing_page.vm',
                directDepositUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/ddForm?stateId=setup&dnr=1',
                paperlessUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/paperlessSignup?stateId=paperlessMainPage&dnr=-1',
                depositChecksUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/account_summary.vm?td=checkUpload',
                mailChecksUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/paper_check_input.vm?processStep=start',
                cashiersChecksUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/cashierscheck?stateId=paymentInfo&dnr=1',
                orderChecksUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/account_summary.vm?td=accountDetailCheckbook%3FdisplayNumber%3D1',
                payPersonUrl: 'https://p2ppaymentsqa.kdc.capitalone.com/#/login?authenticated=true',
                billPayUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/account_summary.vm?td=bill_pay.vm',
                transferUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/deposit_transfer_input.vm?initialize=true',
                transferActivityUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/account_summary.vm?td=transferDepositOverview',
                paymentActivityUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/ummPaymentsOverview?stateId=displayUmmPaymentOverview&dnr=1',
                automaticSavingsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/automatic_savings_plan?stateId=howItWorkss&dnr=-1',
                viewMessagesUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/account_summary.vm?td=message_list.vm',
                deliveryOptionsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/deliveryOptions?stateId=deliveryOptionsView&dnr=1',
                alertsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/cccAlerts?stateId=cccAlertsView&dnr=1',
                textCommandsUrl: 'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/textCommands?stateId=textCommandsView&dnr=1'
            });

    } //end define module function
); //end define
