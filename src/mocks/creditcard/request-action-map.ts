import { RequestMethod } from '@angular/http';

import { accountsModel } from './models/accounts.model';
import { autopayEntitlementsModel } from './models/autopay-entitlements.model';
import { cancelPaymentModel } from './models/cancel-payment.model';
import { cardDetailsTogglesModel } from './models/card_details_toggles.model';
import { easePdPropertiesModel } from './models/ease-pd_properties.model';
import { easeSelfServiceModel } from './models/ease-selfservice-entitlements.model';
import { messagesModel } from './models/messages.model';
import { oneTimePaymentPropertiesModel } from './models/one-time-payment-properties.model';
import { payFromAccountsModel } from './models/pay-from-accounts.model';
import { payToAccountsModel } from './models/pay-to-accounts.model';
import { paymentActivityModel } from './models/payment-activity.model';
import { successfulPaymentModel } from './models/successful-payment.model';

interface RequestActionsMap {
  [key: string]: RequestAction;
}

export interface RequestAction {
  method: RequestMethod;
  urlRegex: RegExp;
  responseData: any;
}

export const requestActionsMap: RequestActionsMap = {
  cancelPayment: {
    method: RequestMethod.Delete,
    urlRegex: /ease-app-web\/CreditCard\/accounts\/.*\/payments\/.*/,
    responseData: cancelPaymentModel
  },
  successfulPayment: {
    method: RequestMethod.Post,
    urlRegex: /ease-app-web\/CreditCard\/accounts\/.*\/payments/,
    responseData: successfulPaymentModel
  },
  cardDetailsToggles: {
    urlRegex: /.*\/ease\/card_details_toggles/,
    method: RequestMethod.Get,
    responseData: cardDetailsTogglesModel
  },
  payFromAccounts: {
    urlRegex: /ease-app-web\/CreditCard\/pay-from-accounts/,
    method: RequestMethod.Get,
    responseData: payFromAccountsModel
  },
  payToAccounts: {
    urlRegex: /ease-app-web\/CreditCard\/.*\/pay-to-account/,
    method: RequestMethod.Get,
    responseData: payToAccountsModel
  },
  paymentActivity: {
    urlRegex: /ease-app-web\/CreditCard\/accounts\/.*\/paymentActivity/,
    method: RequestMethod.Get,
    responseData: paymentActivityModel
  },
  accounts: {
    urlRegex: /ease-app-web\/CreditCard\/v2\/accounts/,
    method: RequestMethod.Get,
    responseData: accountsModel
  },
  autopayEntitlements: {
    urlRegex: /ease-app-web\/CreditCard\/payments\/autopay\/entitlements/,
    method: RequestMethod.Get,
    responseData: autopayEntitlementsModel
  },
  oneTimePaymentProperties: {
    urlRegex: /ease-app-web\/CreditCard\/one-time-payment-properties/,
    method: RequestMethod.Get,
    responseData: oneTimePaymentPropertiesModel
  },
  messages: {
    urlRegex: /CreditCard\/messages/,
    method: RequestMethod.Get,
    responseData: messagesModel
  },
  easeSelfService: {
    urlRegex: /ease-app-web\/CreditCard\/ease\/selfservice\/entitlements/,
    method: RequestMethod.Get,
    responseData: easeSelfServiceModel
  },
  easePdProperties: {
    urlRegex: /ease-app-web\/CreditCard\/ease\/pd_uiproperties/,
    method: RequestMethod.Get,
    responseData: easePdPropertiesModel
  }
};
