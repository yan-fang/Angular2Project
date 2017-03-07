describe('c1Date', function() {
    var d;

    beforeEach(function() {
        d = c1Date('03/12/2015');
    });

    it('should be defined', function() {
        expect(d).toBeDefined();
    });

    it('should return an object', function() {
        expect(typeof d).toEqual('object');
    });

    it('should take no argument and return a date object representing today', function() {
        expect(c1Date().toUTCString()).toEqual(new Date().toUTCString());
    });

    it('should take a date string and return a date object', function() {
        expect(c1Date('03/10/2015').toUTCString()).toEqual(new Date('03/10/2015').toUTCString());
    });

    it('should take a date and return a date object', function() {
        var d1UTC = c1Date(new Date('03/10/2015')).toUTCString();
        var d2UTC = new Date('03/10/2015').toUTCString();
        expect(d1UTC).toEqual(d2UTC);
    });

    it('should take a long date and return a date object', function() {
        var d1UTC = c1Date('2015-04-25T13:07:18.940-04:00').toUTCString();
        var d2UTC = new Date('2015-04-25T13:07:18.940-04:00').toUTCString();
        expect(d1UTC).toEqual(d2UTC);
    });

    it('should take a date in GMT format and handle it properly', function() {
        var d1UTC = c1Date('2015-03-10').toUTCString();
        var d2UTC = new Date('03/10/2015').toUTCString();

        expect(d1UTC).toEqual(d2UTC);
    });

    it('should have a normalize method', function() {
        expect(d.normalize).toBeDefined();
    });

    it('.normalize should return a date flattened to a start date', function() {
        var d1 = d.normalize();

        expect(d1.getHours()).toEqual(0);
        expect(d1.getMinutes()).toEqual(0);
        expect(d1.getSeconds()).toEqual(0);
        expect(d1.getMilliseconds()).toEqual(0);
    });

    it('.normalize should return a c1Date', function() {
        expect(d.normalize('03/10/2015').getDateAt).toBeDefined();
    });

    it('.normalize should take a boolean value set to true and return a flattened end date', function() {
        var d1 = d.normalize(true);

        expect(d1.getHours()).toEqual(23);
        expect(d1.getMinutes()).toEqual(59);
        expect(d1.getSeconds()).toEqual(59);
        expect(d1.getMilliseconds()).toEqual(999);
    });

    it('should have a daysBetween method', function() {
        expect(d.daysBetween).toBeDefined();
    });

    it('.daysBetween should be able to take a date string', function() {
        var o = d.daysBetween('03/17/2015');
        var o2 = d.daysBetween('2015-03-17');
        var o3 = d.daysBetween('2015/03/17');
        var o4 = d.daysBetween('03-17-2015');

        expect(o).toEqual(5);
        expect(o2).toEqual(5);
        expect(o3).toEqual(5);
        expect(o4).toEqual(5);
    });

    it('.daysBetween should be able to take a date object', function() {
        var o = d.daysBetween(new Date('03/17/2015'));

        expect(o).toEqual(5);
    });

    it('.daysBetween should be able to take a date before the initial date', function() {
        var o = d.daysBetween('03/07/2015');
        var o2 = d.daysBetween('2015-03-07');

        expect(o).toEqual(5);
        expect(o2).toEqual(5);
    });

    it('should have a getDateAt method', function() {
        expect(d.getDateAt).toBeDefined();
    });

    it('.getDateAt should take a number and return a date', function() {
        var o = d.getDateAt(5).toUTCString();
        var t = new Date('03/17/2015').toUTCString();

        expect(o).toEqual(t);
    });

    it('.getDateAt should be able to take a negative number and return a date before initial date', function() {
        var o = d.getDateAt(-7).toUTCString();
        var t = new Date('03/05/2015').toUTCString();

        expect(o).toEqual(t);
    });

    it('.getDateAt should return a c1Date object', function() {
        expect(d.getDateAt(5).getDateAt).toBeDefined();
    });

    it('should have a compare method', function() {
        expect(d.compare).toBeDefined();
    });

    it('.compare should return 0 if the dates are equal', function() {
        expect(d.compare('03/12/2015')).toEqual(0);
        expect(d.compare('2015-03-12')).toEqual(0);
        expect(d.compare('03-12-2015')).toEqual(0);
        expect(d.compare('2015/03/12')).toEqual(0);
    });

    it('.compare should return 1 if the initial date is after the input date', function() {
        expect(d.compare('03/27/2015')).toEqual(-1);
        expect(d.compare('2015-03-13')).toEqual(-1);
        expect(d.compare('03-27-2015')).toEqual(-1);
        expect(d.compare('2015/03/27')).toEqual(-1);
    });

    it('.compare should return -1 if the initial date is before the input date', function() {
        expect(d.compare('03/07/2015')).toEqual(1);
        expect(d.compare('2015-03-11')).toEqual(1);
        expect(d.compare('03-07-2015')).toEqual(1);
        expect(d.compare('2015/03/07')).toEqual(1);
    });

    it('should have an isBefore method', function() {
        expect(d.isBefore).toBeDefined();
    });

    it('.isBefore should return a boolean value based on whether the initial date is before the input date', function() {
        expect(d.isBefore('03/13/2015')).toBeTruthy();
        expect(d.isBefore('2015-03-13')).toBeTruthy();
        expect(d.isBefore('03/12/2015')).toBeFalsy();
        expect(d.isBefore('03/11/2015')).toBeFalsy();
    });

    it('should have an isAfter method', function() {
        expect(d.isAfter).toBeDefined();
    });

    it('.isAfter should return a boolean value based on whether the initial date is after the input date', function() {
        expect(d.isAfter('03/10/2015')).toBeTruthy();
        expect(d.isAfter('2015/03/11')).toBeTruthy();
        expect(d.isAfter('03/12/2015')).toBeFalsy();
    });

    it('should have an isEqual method', function() {
        expect(d.isEqual).toBeDefined();
    });

    it('.isEqual should return a boolean value based on whether the initial date is equal to the input date', function() {
        expect(d.isEqual('03/12/2015')).toBeTruthy();
        expect(d.isEqual('2015-03-12')).toBeTruthy();
        expect(d.isEqual('2015-03-11')).toBeFalsy();
        expect(d.isEqual('2015-03-13')).toBeFalsy();
    });

    it('should have an isBetween method', function() {
        expect(d.isBetween).toBeDefined();
    });

    it('.isBetween should take two dates and return a boolean based on whether the initial date falls between to two input dates', function() {
        expect(d.isBetween('03/11/2015', '03/13/2015')).toBeTruthy();
        expect(d.isBetween('2015-03-11', '2015-03-13')).toBeTruthy();
        expect(d.isBetween('03/13/2015', '03/17/2015')).toBeFalsy();
        expect(d.isBetween('03/03/2015', '03/09/2015')).toBeFalsy();
    });

    it('should have a format function', function() {
        expect(d.format).toBeDefined();
        expect(typeof d.format).toEqual('function');
    });

    it('d.format() should take in "yyyy-mm-dd" and return (ex: 2015-12-05)', function() {
        expect(d.format('yyyy-mm-dd')).toEqual('2015-03-12');
        expect(d.format('yy-mm-dd')).toEqual('15-03-12');
        expect(d.format('yyyy-dd-mm')).toEqual('2015-12-03');
        expect(d.format('mm/dd/yy')).toEqual('03/12/15');
        expect(d.format('mm/dd/yyyy')).toEqual('03/12/2015');
        expect(d.format('yyyy/dd/mm')).toEqual('2015/12/03');
        expect(d.format('full')).toEqual('Thursday March 12, 2015');
        expect(d.format('abbrev')).toEqual('Thu Mar 12, 2015');
        expect(d.format('abbrev', 'full')).toEqual('Thu March 12, 2015');
        expect(d.format('full', 'abbrev')).toEqual('Thursday Mar 12, 2015');
        expect(d.format('abbrev', 'abbrev')).toEqual('Thu Mar 12, 2015');
        expect(d.format('full', 'full')).toEqual('Thursday March 12, 2015');
    });
});