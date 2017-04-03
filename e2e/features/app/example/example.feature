Feature: ExampleComponent
# Add acceptance verbage

Scenario: Should have the correct text
  Given I login to 'http://localhost:3001/examples'
  Then The text of 'c1-web-example > h2' should be 'Example Page'

#Scenario: Should display message 'SCSS Sample'
#  Given I login to 'http://localhost:3001/account-summary'
#  Then The text of 'c1-web-app-shell > div > p' should be 'SCSS Sample'
#
#Scenario: Should have the correct color
#  Given I login to 'http://localhost:3001/account-summary'
#  Then The 'color' of 'c1-web-app > div > p' should be 'rgba(1, 139, 187, 1)'
#
#Scenario: Should have the correct font-size
#  Given I login to 'http://localhost:3001/account-summary'
#  Then The 'font-size' of 'c1-web-app > div > p' should be '32px'
