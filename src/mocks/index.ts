import { MockabilityResponses } from '@c1/mockability';

import { requests } from './accounts';
import { creditCardMocks } from './creditcard';
import { accountSummaryMocks } from './account-summary/account-summary';
import { transferAccountsMocks } from './bank/transfer-dialog/transfer-accounts';

export function mocks(): MockabilityResponses {
  return [
    ...requests,
    ...creditCardMocks,
    ...accountSummaryMocks,
    ...transferAccountsMocks
  ];
}
