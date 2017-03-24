Feature: Bank L2
  Scenario: Can navigate to Bank L2
    Given I login
    When I click '[routerLink="/360Checking/123"]'
    Then The url should be 'http://localhost:3001/360Checking/123'
    Then '.past-header' on 'Bank L2' should appear
    When I click back
    Then The url should be 'http://localhost:3001/account-summary'
    When I click '[routerLink="/360Checking/123"]'
    Then The url should be 'http://localhost:3001/360Checking/123'
    Then '.past-header' on 'Bank L2' should appear