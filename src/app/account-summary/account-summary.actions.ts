import { Accounts } from './account.model';

export type FetchAccountSummary = {
  type: 'FetchAccountSummary'
};

export type ShowAccountSummary = {
  type: 'ShowAccountSummary',
  payload: Accounts
};

export type Action = FetchAccountSummary | ShowAccountSummary;
