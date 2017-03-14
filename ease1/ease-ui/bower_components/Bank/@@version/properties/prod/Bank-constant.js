define(['angular'], function(angular) {
        'use strict';

        angular
            .module('BankModule')
            .constant('BankEnvironmentConstants', {
                mySavingsGoalsUrl: 'https://secure.capitalone360.com/myaccount/banking/goaltracker',
                payBillsUrl: 'https://secure.capitalone360.com/myaccount/banking/ummPaymentsOverview?stateId=displayUmmPaymentOverview&dnr=1',
                eStatementsUrl: 'https://secure.capitalone360.com/myaccount/banking/estatements.vm',
                directbankDefaultUrl: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm',
                billPayOverview: 'https://secure.capitalone360.com/myaccount/banking/ummPaymentsOverview',
                checkingTandCUrl: 'https://home.capitalone360.com/terms_360checking',
                savingTandCUrl: 'https://home.capitalone360.com/terms_360savings',
                tccTandCUrl: 'https://home.capitalone360.com/terms_totalcontrolchecking',
                csaTandCUrl: 'https://home.capitalone360.com/terms_confidencesavings',
                directMoneyTandCUrl: 'https://home.capitalone360.com/terms_360moneymarket',
                moneyTandCUrl: 'https://home.capitalone360.com/terms_money',
                ksaTandCUrl: 'https://home.capitalone360.com/terms_ksa',
                cdTandCUrl: 'https://home.capitalone360.com/terms_cd',
                iraSavingTandCUrl: 'https://home.capitalone360.com/terms_ira',
                iraCdTandCUrl: 'https://home.capitalone360.com/terms_ira',
                cdTruthInSavingDisclosure: 'https://home.capitalone360.com/myaccount/plain/tisa_print.vm',
                retailBillpayUrl: 'https://banking1.capitalone.com/olb-web/bill-pay-schedule',
                retailTandCUrl: 'https://banking1.capitalone.com/olb-web/terms_conditions',
                retailIraTransferMoneyUrl: 'https://banking1.capitalone.com/olb-web/container/transfers',
                retailMessageCenter: 'https://banking1.capitalone.com/olb-web/messageCenter'
            })
            .constant('RetailMoreServicesConstants', {
                debitActivationUrl: 'https://banking.capitalone.com/olb-web/cardActivate',
                paperlessPreferencesUrl: 'https://banking.capitalone.com/olb-web/paperless-preferences'
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
                activationDefaultUrl: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm',
                pinManagementUrl: 'https://secure.capitalone360.com/myaccount/banking/changeCardPin?stateId=sendPin&dnr=1',
                lockDefaultUrl: 'https://secure.capitalone360.com/myaccount/banking/debitcard?execution=e3s2&stateId=deactivateStart&dnr=1',
                unlockDefaultUrl: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm',
                travelNotifyUrl: 'https://secure.capitalone360.com/myaccount/banking/accountDetailDebitCard?stateId=debitTabRender&dnr=1',
                externalAccountsUrl: 'https://secure.capitalone360.com/myaccount/banking/externalLink?stateId=displayIndividualLinks&dnr=-1',
                accessCodeUrl: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm?td=accessCode',
                contactInfoUrl: 'https://secure.capitalone360.com/myaccount/banking/contactinfo?stateId=contactInfo&dnr=-1',
                signInInfoUrl: 'https://secure.capitalone360.com/myaccount/banking/signinoptions_sso.vm',
                privacyUrl: 'https://secure.capitalone360.com/myaccount/banking/privacy?stateId=viewPrivacy&dnr=-1',
                overdraftUrl: 'https://secure.capitalone360.com/myaccount/banking/accountDetailOverdraft?stateId=mainView&dnr=1',
                referAFriendUrl: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm?td=referAFriend',
                documentsUrl: 'https://secure.capitalone360.com/myaccount/banking/accountDetailForms?stateId=accountDetailForms&dnr=1',
                statementsUrl: 'https://secure.capitalone360.com/myaccount/banking/estatements.vm',
                taxFormsUrl: 'https://secure.capitalone360.com/myaccount/banking/tax_forms_landing_page.vm',
                directDepositUrl: 'https://secure.capitalone360.com/myaccount/banking/ddForm?stateId=setup&dnr=1',
                paperlessUrl: 'https://secure.capitalone360.com/myaccount/banking/paperlessSignup?stateId=paperlessMainPage&dnr=-1',
                depositChecksUrl: 'https://secure.capitalone360.com/myaccount/banking/checkdeposit_overview.vm',
                mailChecksUrl: 'https://secure.capitalone360.com/myaccount/banking/paper_check_input.vm?processStep=start',
                cashiersChecksUrl: 'https://secure.capitalone360.com/myaccount/banking/cashierscheck?stateId=paymentInfo&dnr=1',
                orderChecksUrl: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm?td=accountDetailCheckbook%3FdisplayNumber%3D1',
                payPersonUrl: 'https://p2ppayments.capitalone.com/#/login?authenticated=true',
                billPayUrl: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm?td=bill_pay.vm',
                transferUrl: 'https://secure.capitalone360.com/myaccount/banking/deposit_transfer_input.vm?initialize=true',
                transferActivityUrl: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm?td=transferDepositOverview',
                paymentActivityUrl: 'https://secure.capitalone360.com/myaccount/banking/ummPaymentsOverview?stateId=displayUmmPaymentOverview&dnr=1',
                automaticSavingsUrl: 'https://secure.capitalone360.com/myaccount/banking/automatic_savings_plan?stateId=howItWorkss&dnr=-1',
                viewMessagesUrl: 'https://secure.capitalone360.com/myaccount/banking/account_summary.vm?td=message_list.vm',
                deliveryOptionsUrl: 'https://secure.capitalone360.com/myaccount/banking/deliveryOptions?stateId=deliveryOptionsView&dnr=1',
                alertsUrl: 'https://secure.capitalone360.com/myaccount/banking/cccAlerts?stateId=cccAlertsView&dnr=1',
                textCommandsUrl: 'https://secure.capitalone360.com/myaccount/banking/textCommands?stateId=textCommandsView&dnr=1'
            });

    } //end define module function
); //end define
