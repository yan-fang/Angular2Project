Feature: transfer-dialog
  Scenario: Can close the transfer dialog using the X button
    Given I login
    When I click button 'Show Transfer Dialog'
    Then The url should be 'http://localhost:3001/account-summary/27272/Transfer'
    When '.ease-modal-close-button' on 'EaseModal' appears
    When I click '.ease-modal-close-button'
    Then The url should be 'http://localhost:3001/account-summary'

  Scenario: Can close the transfer dialog using the browser back button
    Given I login
    When I click button 'Show Transfer Dialog'
    Then The url should be 'http://localhost:3001/account-summary/27272/Transfer'
    When '.ease-modal-close-button' on 'EaseModal' appears
    When I click back
    Then The url should be 'http://localhost:3001/account-summary'
