define(['angular'], function(angular) {
  angular.module('PhysicalAddressLink', []).constant('PhysicalAddressLink', {
    creditCardUrl: 'https://intqaeos.kdc.capitalone.com/C1/Go.aspx?LinkThru=UpdateMailingAddress',
    bankUrl:'https://secure-qa2.int.capitalone360qa.com/myaccount/banking/contactinfo?stateId=contactInfo&dnr=-1'
  })
})
