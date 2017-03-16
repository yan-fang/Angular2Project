Feature: credit-card
# TODO: Add acceptance verbage

Scenario: Can navigate to credit-card via a link
  Given I login
  When I click '[routerLink="/credit-card"]'
  Then The url should be 'http://localhost:3001/credit-card'

Scenario: Can navigate directly to credit-card
  Given I login to 'http://localhost:3001/credit-card'
  Then The url should be 'http://localhost:3001/credit-card'

Scenario: CreditCardComponent has the correct title
  Given I login to 'http://localhost:3001/credit-card'
  Then The text of 'c1-creditcard > h2' should be 'CreditCard Title (L2)'
