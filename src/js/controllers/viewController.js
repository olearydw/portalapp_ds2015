define([
  "dojo/ready",
  "dojo/dom",
  "dojo/dom-style",
  "dojo/dom-attr",
  "dojo/_base/array",
  "models/modelmodule",
  "utils/datesmodule",
  "config/config",
], function (ready, dom, domStyle, domAttr, array, modelmodule, datesmodule, config) {

  var view = {};

  ready(function () {
    //console.log('view module ready');
    doWritePageElementText();
  });

  view.doSetLoginView = function (loggedIn) {
    loggedIn ? view.doShowSignedIn() : view.doShowSignedOut();
  };

  view.doShowSignedIn = function () {
    domStyle.set("signInBtn", "display", "none");
    domStyle.set("signOutBtn", "display", "block");
    //domStyle.set("loggedInDiv", "opacity", 1);
  };

  view.doShowSignedOut = function () {
    domStyle.set("signInBtn", "display", "block");
    domStyle.set("signOutBtn", "display", "none");
    //domStyle.set("loggedInDiv", "opacity", 0);
  };

  view.doCreateItemGallery = function (items) {
    var htmlGallery = "";
    array.forEach(items, function (item) {
      htmlGallery += (
        "<div class=\"esri-item-container\">" +
        (
          item.thumbnailUrl ?
          "<div class=\"esri-image\" style=\"background-image:url(" + item.thumbnailUrl + ");\"></div>" :
            "<div class=\"esri-image esri-null-image\">Thumbnail not available</div>"
        ) +
        (
          item.title ?
          "<div class=\"esri-title\">" + (item.title || "") + "</div>" :
            "<div class=\"esri-title esri-null-title\">Title not available</div>"
        ) +
        "</div>"
        );
      dom.byId("itemGallery").innerHTML = htmlGallery;
    });
  };

  view.updateDivElementDisplayStyle = function (divId, val) {
    domStyle.set(divId, "display", val);
  };

  function doWritePageElementText() {
    dom.byId("appTitle").innerHTML = config.appTitle;
    dom.byId("appSubTitle").innerHTML = config.appSubtitle;
  };

  view.doShowNavButtons = function () {
    //console.log('set opacity of nav');
    domStyle.set("navButtons", "opacity", 1);
  };

  return view;
});