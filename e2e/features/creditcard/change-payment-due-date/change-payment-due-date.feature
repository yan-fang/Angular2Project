Feature: change-payment-due-date
# TODO: Add acceptance verbage

Scenario: Can navigate to change-payment-due-date via a link
  Given I login
  When I click '[routerLink="/credit-card"]'
  When I click 'c1-creditcard [routerLink="change-payment-due-date"]'
  Then The url should be 'http://localhost:3001/credit-card/change-payment-due-date'

Scenario: Can navigate directly to change-payment-due-date
  Given I login to 'http://localhost:3001/credit-card/change-payment-due-date'
  Then The url should be 'http://localhost:3001/credit-card/change-payment-due-date'

Scenario: ChangePaymentDueDateComponent should have the correct title
  Given I login to 'http://localhost:3001/credit-card/change-payment-due-date'
  Then The text of 'c1-creditcard-change-payment-due-date > h2' should be 'Change Payment Due Date Title (L3)'
