Feature: Bank L2
  Scenario: Can navigate to Bank L2
    Given I login
    When I click '[routerLink="/RewardsChecking/RBf6iH+ucQ6mIf884wU8AvzPXWB7dvZyyhpWnuomzPM="]'
    Then The url should be 'http://localhost:3001/RewardsChecking/RBf6iH%2BucQ6mIf884wU8AvzPXWB7dvZyyhpWnuomzPM%3D'
    Then '.past-header' on 'Bank L2' should appear
    When I click back
    Then The url should be 'http://localhost:3001/account-summary'
    When I click '[routerLink="/RewardsChecking/RBf6iH+ucQ6mIf884wU8AvzPXWB7dvZyyhpWnuomzPM="]'

    # TODO: fix this - it looks like the request goes to "RBf6iH+ucQ6mIf884wU8AvzPXWB7dvZyyhpWnuomzPM" instead of
    # "RBf6iH+ucQ6mIf884wU8AvzPXWB7dvZyyhpWnuomzPM=" (notice that the "=" character gets truncated)

    # Then The url should be 'http://localhost:3001/RewardsChecking/RBf6iH+ucQ6mIf884wU8AvzPXWB7dvZyyhpWnuomzPM'
    Then The url should be 'http://localhost:3001/RewardsChecking/RBf6iH%2BucQ6mIf884wU8AvzPXWB7dvZyyhpWnuomzPM%3D'
    Then '.past-header' on 'Bank L2' should appear
