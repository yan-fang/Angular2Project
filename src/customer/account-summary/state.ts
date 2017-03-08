import { Accounts } from './account.model';

// accountSummary property must match the reducer name
export interface State {
  customer: {accountSummary: Accounts};
}
