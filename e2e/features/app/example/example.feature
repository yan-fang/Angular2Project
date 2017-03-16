Feature: ExampleComponent
# Add acceptance verbage

Scenario: Should have the correct text
  Given I login to 'http://localhost:3001/account-summary'
  Then The text of 'c1-web-example > h1' should be 'Example Page'
