// Utility for handling date ojects across the app
define([
	"dojo/ready",
	"dojo/dom",
	"dojo/on",
	"dojo/date"
], function (ready, dom, on, date) {
  var dates = {};

  ready(function () {
    //console.log('dates module is ready');
  });

  dates.getTodayValue = function () {
    var d = new Date();
    return d;
  };

  dates.formatDateToUTC = function (dateObj) {
    return dateObj.toUTCString();
  };

  dates.getDateFromDaysAgo = function (daysAgo) {
    var val = Number(daysAgo) * -1;
    var d1 = dates.getTodayValue();
    var d2 = date.add(d1, 'day', val);
    return d2;
  };





  return dates;
});