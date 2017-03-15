export const transferAccounts = {
  'easeDisplayError': {
    'severity': null,
    'headerMessage': null,
    'displayMessage': null,
    'errorIdString': null,
    'developerMessage': null
  },
  'type': 'transferAccountsEntityCollectionResponse',
  'entries': [
    {
      'type': 'accountInfo',
      'accountReferenceId': 'lolxlolFakeAccountReference',
      'moneyTransferAccountReferenceId': 'lolxlolFakeMoneyTransferAccountRefrenceId',
      'accountType': '360 CHECKING',
      'accountUseDescription': 'PERSONAL',
      'productGroup': 'Capital One Direct (360)',
      'displayAccountNumber': 'XXXXXX1153',
      'displayAccountIndicator': 'false',
      'availableBalance': '5647.32',
      'withOverdraftAvailableBalance': '5647.32',
      'currencyCode': 'USD',
      'bankName': 'Capital One',
      'eligibleDebitOffsetAccounts': [
        {
          'moneyTransferAccountReferenceId': [
            'someDebitOffsetMoneyTransferAccountReferenceId'
          ],
          'permissions': []
        },
        {
          'moneyTransferAccountReferenceId': [
            'someOtherDebitOffsetMoneyTransferAccountReferenceId'
          ],
          'permissions': []
        }
      ],
      'eligibleCreditOffsetAccounts': [
        {
          'moneyTransferAccountReferenceId': [
            'someCreditOffsetMoneyTransferAccountReferenceId'
          ],
          'permissions': []
        },
        {
          'moneyTransferAccountReferenceId': [
            'someOtherCreditOffsetMoneyTransferAccountReferenceId'
          ],
          'permissions': []
        }
      ],
      'accountLimitDetails': [],
      'permissions': [
        {
          'permissionName': 'Credit and Debit Allowed',
          'permissionDescription': 'Credit and Debit Allowed'
        }
      ],
      'accountNickName': 'fakeAccountName',
      'aba': '012345678'
    },
    {
      'type': 'accountInfo',
      'moneyTransferAccountReferenceId': 'externalAccountMoneyTransferAccountReferenceId',
      'externalAccountReferenceId': 'thisIsSomeExternalAccountReferenceId',
      'accountType': 'Direct External Checking',
      'productGroup': 'Capital One Direct (360) External',
      'displayAccountNumber': 'XXXXXX7508',
      'displayAccountIndicator': 'true',
      'currencyCode': 'USD',
      'bankName': 'JPMORGAN CHASE',
      'eligibleDebitOffsetAccounts': [
        {
          'moneyTransferAccountReferenceId': [
            'someExternalDebitOffsetMoneyTransferAccountReferenceId'
          ],
          'permissions': []
        },
        {
          'moneyTransferAccountReferenceId': [
            'someOtherExternalDebitOffsetMoneyTransferAccountReferenceId'
          ],
          'permissions': []
        }
      ],
      'eligibleCreditOffsetAccounts': [
        {
          'moneyTransferAccountReferenceId': [
            'someExternalCreditOffsetMoneyTransferAccountReferenceId'
          ],
          'permissions': []
        },
        {
          'moneyTransferAccountReferenceId': [
            'someOtherExternalCreditOffsetMoneyTransferAccountReferenceId'
          ],
          'permissions': []
        }
      ],
      'accountLimitDetails': [],
      'permissions': [
        {
          'permissionName': 'Credit and Debit Allowed',
          'permissionDescription': 'Credit and Debit Allowed'
        }
      ],
      'accountNickName': 'JPMORGAN CHASE',
      'aba': '987654321'
    }
  ],
  'easternTime': '2017/03/02 12:25:06'
};
