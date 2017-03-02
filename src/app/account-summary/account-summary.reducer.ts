import { Accounts } from './account.model';
import { Action } from './account-summary.actions';

export function accountSummary(state: Accounts = [], action: Action): Accounts {
  switch (action.type) {
    case 'ShowAccountSummary':
      return action.payload;
    default:
      return state;
  }
}
