define([
	"dojo/ready",
  "dojo/_base/array",
  "dojox/charting/Chart",
  "dojox/charting/themes/Tufte",
  "dojox/charting/plot2d/Bubble",
  "dojox/charting/plot2d/Markers",
  "dojox/charting/axis2d/Default",
  "dojox/charting/action2d/Tooltip",
	"dojox/charting/action2d/Highlight",
	"dojox/charting/action2d/Magnify",
  "dojo/fx/easing",
  "dojo/domReady!"
], function (ready, array, Chart, theme, Bubble, Marker, Default, Tooltip, Highlight, Magnify, easing) {

  var chart = {};
  var pcHighCount = 0;
  var pcLowCount = 0;

  ready(function () {
    //console.log('charts module ready');
  });

  chart.getItemPunchCardChart = function (data, divId) {
    var pcArr = [];
    var labelsArr = [
      { value: 0, text: "Sun" },
		  { value: 1, text: "Mon" },
      { value: 2, text: "Tue" },
		  { value: 3, text: "Wed" },
      { value: 4, text: "Thu" },
		  { value: 5, text: "Fri" },
      { value: 6, text: "Sat" }
    ];
    var xAxixLabelsArr = [
      { value: 0, text: "12a" },
		  { value: 1, text: "1a" },
      { value: 2, text: "2a" },
		  { value: 3, text: "3a" },
      { value: 4, text: "4a" },
		  { value: 5, text: "5a" },
      { value: 6, text: "6a" },
      { value: 7, text: "7a" },
		  { value: 8, text: "8a" },
      { value: 9, text: "9a" },
		  { value: 10, text: "10a" },
      { value: 11, text: "11a" },
		  { value: 12, text: "12p" },
      { value: 13, text: "1p" },
      { value: 14, text: "2p" },
      { value: 15, text: "3p" },
		  { value: 16, text: "4p" },
      { value: 17, text: "5p" },
		  { value: 18, text: "6p" },
      { value: 19, text: "7p" },
		  { value: 20, text: "8p" },
      { value: 21, text: "9p" },
      { value: 22, text: "10p" },
      { value: 23, text: "11p" }
    ];

    var xTitle = "When are members contributing content?";

    array.forEach(data, function (val) {
      if (val.count > pcHighCount) {
        pcHighCount = val.count;
      };
      if (val.count < pcLowCount) {
        pcLowCount = val.count;
      };

    });

    for (var i = 0, j = data.length; i < j; i++) {
      pcArr.push({ x: data[i].hour, y: data[i].d, size: calcSymSize(data[i].count), count: data[i].count });
    };

    var pcChart = new Chart(divId, {
      title: xTitle,
      titlePos: "top",
      titleGap: 40,
      titleFont: "normal normal normal 1.25em 'Lucida Grande', 'Segoe UI', 'Arial', sans-serif"
      //titleFontColor: "orange"
    });
    pcChart.setTheme(theme);
    pcChart.addPlot("default", {
      type: "Bubble"
    });

    pcChart.addAxis("x",
      {
        labels: xAxixLabelsArr,
        fontColor: '#939393',
        font: "normal normal normal 0.875em 'Lucida Grande', 'Segoe UI', 'Arial', sans-serif",
        rotation: 0,
        stroke: { color: '#F2F2F2', width: 1 },
        minorTicks: true,
        minorLabels: true,
        minorTick: { length: 10, color: "#FFFFFF" }
        //max: (xValues.length + .50)
      });

    pcChart.addAxis("y",
      {
        vertical: true,
        fixLower: "major",
        fixUpper: "major",
        labels: labelsArr,
        includeZero: true,
        majorLabels: true,
        minorLabels: true,
        minorTicks: false,
        majorTick: { length: 0, color: "#FF0000" },
        natural: true,
        fontColor: '#939393',
        font: "normal normal normal 0.875em 'Lucida Grande', 'Segoe UI', 'Arial', sans-serif",
        stroke: { color: '#D5D5D5', width: 1 },
        max: labelsArr.length - 1
      });

    pcChart.addSeries("pc", pcArr);

    var tooltip = new Tooltip(pcChart, "default", {
      text: function (e) {
        return "<p class='chartTip'>" + (e.run.data[e.index].count) + " contributions</p>";
      }
    });

    var custHighlight = new Highlight(pcChart, "default", {
      duration: 400,
      easing: dojo.fx.easing.sineOut,
      highlight: "#56A5DB"
    });

    pcChart.render();

  };

  function calcSymSize(countVal) {
    var maxSymSize = .6;
    if (countVal === 0) {
      return 0;
    } else if (countVal === pcHighCount) {
      return maxSymSize;
    } else {
      var tmp = (countVal / pcHighCount);
      var thisSymSize = (maxSymSize * tmp);
      return thisSymSize;
    };
  };




  


  return chart;
});