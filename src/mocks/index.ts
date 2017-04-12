import { MockabilityResponses } from '@c1/mockability';

import { requests } from './accounts';
import { creditCardMocks } from './creditcard';
import { accountSummaryMocks } from './account-summary/account-summary';
import { transferAccountsMocks } from './bank/transfer-dialog/transfer-accounts';
import { sharedMocks } from './shared/shared';
import { bankMocks } from './bank/L2/bank';
import { billPayMocks } from './bank/L2/billpay';
import { autoLoanMocks } from './auto-loan/L2/auto-loan';

export function mocks(): MockabilityResponses {
  return [
    ...requests,
    ...sharedMocks,
    ...creditCardMocks,
    ...accountSummaryMocks,
    ...transferAccountsMocks,
    ...bankMocks,
    ...billPayMocks,
    ...autoLoanMocks
  ];
}
