function c1Date(date) {
    var _day = 24 * 60 * 60 * 1000;

    date = typeof date !== 'undefined' ? _forceDate(date) : new Date();
    _checkConflict(date);
    date = _extend(date);

    function isBetween(d1, d2) {
        var output1 = compare.call(this, d1);
        var output2 = compare.call(this, d2);

        return (output1 >= 0 && output2 <= 0);
    }

    function isEqual(d) {
        return compare.call(this, d) === 0;
    }

    function isAfter(d) {
        return compare.call(this, d) === 1;
    }

    function isBefore(d) {
        return compare.call(this, d) === -1;
    }

    function compare(d) {
        var thisDateUTC = _getUTC(this);
        var dUTC = _getUTC(normalize.call(_forceDate(d)));

        if(thisDateUTC > dUTC) {
            return 1;
        } else if(thisDateUTC < dUTC) {
            return -1;
        } else {
            return 0;
        }
    }

    function normalize(isEnd) {
        var d = new Date(this);

        if(isEnd) {
            d.setHours(23);
            d.setMinutes(59);
            d.setSeconds(59);
            d.setMilliseconds(999);
        } else {
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
        }

        return _extend(d);
    }

    function daysBetween(d) {
        var d1 = normalize.call(this);
        var d2 = normalize.call(_forceDate(d));

        return Math.round(Math.abs(_getUTC(d1) - _getUTC(d2)) / _day);
    }

    function getDateAt(days) {
        var tempDate = new Date(normalize.call(this));
        tempDate.setDate(tempDate.getDate() + days);
        return _extend(tempDate);
    }
    
    function format(formatString, optionalMonthFormatString) {
        var matchString = formatString.toLowerCase();
        var d = this;
        var year = d.getFullYear();
        var day = d.getDate();
        var month = d.getMonth();

        if(matchString === 'full' || matchString === 'abbrev') {
            var mapping = {
                day: [
                    { abbrev: 'Sun', full: 'Sunday'},
                    { abbrev: 'Mon', full: 'Monday'},
                    { abbrev: 'Tue', full: 'Tuesday'},
                    { abbrev: 'Wed', full: 'Wednesday'},
                    { abbrev: 'Thu', full: 'Thursday'},
                    { abbrev: 'Fri', full: 'Friday'},
                    { abbrev: 'Sat', full: 'Saturday'}
                ],
                month: [
                    { abbrev: 'Jan', full: 'January'},
                    { abbrev: 'Feb', full: 'February'},
                    { abbrev: 'Mar', full: 'March'},
                    { abbrev: 'Apr', full: 'April'},
                    { abbrev: 'May', full: 'May'},
                    { abbrev: 'Jun', full: 'June'},
                    { abbrev: 'Jul', full: 'July'},
                    { abbrev: 'Aug', full: 'August'},
                    { abbrev: 'Sept', full: 'September'},
                    { abbrev: 'Oct', full: 'October'},
                    { abbrev: 'Nov', full: 'November'},
                    { abbrev: 'Dec', full: 'December'}
                ]
            };

            var getDayNameVal = d.getDay();
            var dayName = mapping.day[getDayNameVal][matchString];
            var monthName;

            if(optionalMonthFormatString !== undefined) {
                optionalMonthFormatString = optionalMonthFormatString.toLowerCase();
                monthName = mapping.month[month][optionalMonthFormatString];
            } else {
                monthName = mapping.month[month][matchString];
            }

            formatString = _buildLongDateName(dayName, monthName, day, year);

        } else {
            var shortYear = String(year).substring(2);
            month += 1;

            month = _addLeadingZero(month);
            day = _addLeadingZero(day);

            formatString = formatString.replace('yyyy', year);
            formatString = formatString.replace('yy', shortYear);
            formatString = formatString.replace('mm', month);
            formatString = formatString.replace('dd', day);
        }

        return formatString;

        function _addLeadingZero(val) {
            if(val < 10) { val = '0' + val }
            return val;
        }

        function _buildLongDateName(dayName, monthName, day, year) {
            return dayName + ' ' +  monthName + ' ' + _addLeadingZero(day) + ', ' + year;
        }
    }

    function _getUTC(d) {
        return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    }

    function _extend(d) {
        if(d.isC1Date === undefined) {
            d.isBetween = isBetween;
            d.isEqual = isEqual;
            d.isAfter = isAfter;
            d.isBefore = isBefore;
            d.compare = compare;
            d.normalize = normalize;
            d.daysBetween = daysBetween;
            d.getDateAt = getDateAt;
            d.format = format;
            d.isC1Date = true;
        }

        return d;
    }

    function _forceDate(d) {
        if(typeof d === 'string') {
            var maxValidCharacters = 10;

            d = (d.length <= maxValidCharacters) ? new Date(d.replace('-', '/')) : new Date(d);
        }
        return d;
    }

    function _checkConflict(d) {
        var properties = [
            'normalize',
            'daysBetween',
            'getDateAt',
            'compare',
            'isBefore',
            'isAfter',
            'isEqual',
            'isBetween',
            'format'
        ];

        for(var i = 0; i < properties.length; i++) {
            var currentProperty = properties[i];

            if(d[currentProperty]) {
                throw new Error('c1Date may be overriding the following default Javascript Date property: ' + currentProperty);
            }
        }
    }

    return date;
}