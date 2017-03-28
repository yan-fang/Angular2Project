define(['angular'], function(angular) {
  angular.module('PhysicalAddressLink', []).constant('PhysicalAddressLink', {
    creditCardUrl: 'https://servicing.capitalone.com/C1/Go.aspx?LinkThru=UpdateMailingAddress',
    bankUrl:'https://secure.capitalone360.com/myaccount/banking/contactinfo?stateId=contactInfo&dnr=-1'
  })
})
