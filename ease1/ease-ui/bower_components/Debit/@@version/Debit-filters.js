define(['angular'], function(angular) {
  'use strict';

  angular
    .module('DebitModule')
    .filter('timeAgo', function() {

      return function(timestamp) {

        var TIME =  {
          seconds: 'less than a minute',
          minute: 'about a minute',
          minutes: '%d minutes',
          hour: 'about an hour',
          hours: 'about %d hours',
          day: 'a day',
          days: '%d days',
          month: 'about a month',
          months: '%d months',
          year: 'about a year',
          years: '%d years'
        };

        var
          currentTime = (new Date()).getTime(),
          toBeHumanized = (new Date(timestamp)).getTime(),
          seconds = Math.abs( currentTime - toBeHumanized ) / 1000,
          minutes = seconds / 60,
          hours = minutes / 60,
          days = hours / 24,
          years = days / 365,
          humanizedTime = seconds < 45 && TIME.seconds.replace(/%d/i,  Math.round(seconds)) ||
              seconds < 90 && TIME.MINUTE ||
              minutes < 45 && TIME.minutes.replace(/%d/i, Math.round(minutes) ) ||
              minutes < 90 && TIME.HOUR ||
              hours < 24 && TIME.hours.replace(/%d/i, Math.round(hours) ) ||
              hours < 42 && TIME.DAY ||
              days < 30 && TIME.days.replace(/%d/i, Math.round(days) ) ||
              days < 45 && TIME.MONTH ||
              days < 365 && TIME.months.replace(/%d/i, Math.round(days / 30) ) ||
              years < 1.5 && TIME.YEAR || TIME.years.replace(/%d/i, Math.round(years) );

        return (humanizedTime);

      };

    });

});
