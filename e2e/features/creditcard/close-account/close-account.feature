Feature: close-account
# TODO: Add acceptance verbage

Scenario: Can navigate to close-account via a link
  Given I login
  When I click '[routerLink="/credit-card"]'
  When I click 'c1-creditcard [routerLink="close-account"]'
  Then The url should be 'http://localhost:3001/credit-card/close-account'

Scenario: Can navigate directly to close-account
  Given I login to 'http://localhost:3001/credit-card/close-account'
  Then The url should be 'http://localhost:3001/credit-card/close-account'

Scenario: CloseAccountComponent should have the correct title
  Given I login to 'http://localhost:3001/credit-card/close-account'
  Then The text of 'c1-creditcard-close-account > h2' should be 'Close Account Title (L3)'
