Feature: App
# Add acceptance verbage

Scenario: Default route should be account-summary
  Given I login
  Then The url should be 'http://localhost:3001/account-summary'

Scenario: Page should have an angular 2 shell
  Given I login to 'http://localhost:3001/account-summary'
  Then 'c1-web-app > c1-web-app-shell' on 'Account Summary' should appear

Scenario: Page should have a header
  Given I login to 'http://localhost:3001/account-summary'
  Then 'c1-web-app > c1-web-app-shell > c1-header' on 'Account Summary' should appear

Scenario: Page should have an Account Summary Component
  Given I login to 'http://localhost:3001/account-summary'
  Then 'c1-web-app > c1-web-app-shell > c1-account-summary' on 'Account Summary' should appear
