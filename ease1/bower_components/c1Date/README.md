# c1Date

## Example usage:

    var d = c1Date();

Return a date flattened to the earliest time of the day:

    c1Date('03/10/2015').normalize(); 
    //returns c1Date object that has 0 hours, 0 minutes, 0 seconds, 0 milliseconds
    
Return a date flattened to the latest time of the day:

    c1Date('03/10/2015').normalize(true);
    //returns c1Date object that has 23 hours, 59 minutes, 59 seconds, 999 milliseconds

Return the number of days between the initial date and the date passed into the daysBetween method:

    c1Date('03/10/2015').daysBetween(’03/15/2015’); //5

Return a date 5 days after the initial date:

    c1Date('03/10/2015').getDateAt(5); 
    //returns c1Date object that is set to '03/15/2015'
    
Return a date 5 days before the initial date:

    c1Date('03/10/2015').getDateAt(-5); 
    //returns c1Date object that is set to '03/05/2015'

Easily compare dates:

    var d = c1Date('03/05/2015');
    d.isBefore('03/10/2015'); //true
    d.isAfter('03/10/2015'); //false
    d.isEqual('03/05/2015'); //true
    d.compare('03/05/2015'); //0
    d.compare('03/10/2015'); //-1
    d.compare('03/03/2015'); //1
    d.isBetween('03/03/2015', '03/20/2015'); //true
    
Easily format dates:

    var d = c1Date('03/12/2015');
    d.format('mm/dd/yyyy') // 03/12/2015
    d.format('mm-dd-yyyy') // 03-12-2015
    d.format('yyyy/mm/dd') // 2015/03/12
    d.format('yyyy-mm-dd') // 2015-03-12
    d.format('full') // Thursday March 12, 2015
    d.format('abbrev') // Thu Mar 12, 2015
    d.format('full', 'abbrev') // Thursday Mar 12, 2015
    d.format('abbrev', 'full') // Thu March 12, 2015
    
## AngularJS

For ease of use with AngularJS applications a simple plugin module and service has been added. 

Example:

    Just simply add c1-date to your AngularJS app then you will have the service available.
    var app = angular.module('app', ['c1-date']);


    Example using c1Date in a controller:
    app.controller('AppController', function(c1Date) {});


    Example using c1Date in another service:
    app.factory('AppFactory', function(c1Date) {});
