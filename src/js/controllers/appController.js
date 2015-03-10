define([
  "dojo/ready",
  "dojo/dom-style",
  "dojo/dom-attr",
  "dojo/dom",
  "dojo/on",
  "dojo/_base/array",
  "dojo/store/Memory",
  "utils/loginmodule",
  "utils/datesmodule",
  "utils/chartsmodule",
  "controllers/viewController",
  "controllers/portalController",
  "controllers/mapController",
  "models/modelmodule",
  "config/config",
  "dojo/domReady!"
], function (ready, domStyle, domAttr, dom, on, array, Memory, loginmodule, datesmodule, chartsmodule, viewController, portalController, mapController, modelmodule, config) {

  var punchCardDataStore = [];
  var dayStringLookupStore;
  var limit = config.itemCountLimit;

  ready(function () {
    loginmodule.doCheckLoginStatus(function (loggedIn) {
      viewController.doSetLoginView(loggedIn);
      if (loggedIn) {
        var configUrl = modelmodule.getConfigPortalUrl();
        viewController.doShowNavButtons();
        portalController.createPortalObj(configUrl, function (portalObj) {
          console.log('PORTAL CREATED');
        });
      };


    });
    doSetEventHandlers();
    doCreateDayStringValStore(function(val){
      if (val) {
        doCreatePunchCardDataStoreTemplate();
      };
    });
  });

  function doSetEventHandlers() {
    on(dom.byId("signInBtn"), "click", handleSignIn);
    on(dom.byId("signOutBtn"), "click", handleSignOut);
    on(dom.byId("navButtons"), "click", handleNavClick);
    on(dom.byId("polyLayer"), "click", handleLayerInputClick);
    on(dom.byId("pointLayer"), "click", handleLayerInputClick);
    on(dom.byId("btnGrpDiv"), "click", handleItemsViewBtnClick);
  };


  function handleSignIn() {
    loginmodule.doOauthFormLogin(function (loggedIn) {
      viewController.doSetLoginView(loggedIn);
      viewController.doShowNavButtons();
      if (loggedIn) {
        var configUrl = modelmodule.getConfigPortalUrl();
        portalController.createPortalObj(configUrl, function (portalObj) {
          console.log('PORTAL CREATED');
        });
      };

    });
  };

  function handleSignOut() {
    loginmodule.doOauthSignOut(function (loggedOut) {
      window.location.reload();
    });
  };

  function getUserItems() {
    var orgId = portalController.getPortalOrgId();
    var endDate = datesmodule.getTodayValue();
    var startDate = datesmodule.getDateFromDaysAgo(config.punchCardDaysAgoVal);
    endDate = "000000" + Math.floor(endDate.getTime() / 1000);
    startDate = "000000" + Math.floor(startDate.getTime() / 1000);

    var qParams = {
      //q: "owner:" + pObj.user.username,
      q: 'modified:[' + startDate + ' TO ' + endDate + '] AND accountid:' + orgId,
      t: 'content',
      start: 1,
      num: 100,
      f: 'json',
      sortField: "numViews",
      sortOrder: "desc"
    };
    getItemsForGalleryView(qParams);
  };




  function getItemsForGalleryView(qParams) {
    portalController.getItems(qParams, limit, function (itemsArr) {
      modelmodule.setItemsStore(itemsArr, function (data) {
        console.log('items now in store');
        viewController.doCreateItemGallery(data);
      });

    });
  };


  function getItemsForMap() {
    var orgId = portalController.getPortalOrgId();
    var endDate = datesmodule.getTodayValue();
    var startDate = datesmodule.getDateFromDaysAgo(config.punchCardDaysAgoVal);
    endDate = "000000" + Math.floor(endDate.getTime() / 1000);
    startDate = "000000" + Math.floor(startDate.getTime() / 1000);

    var qParams = {
      q: 'modified:[' + startDate + ' TO ' + endDate + '] AND accountid:' + orgId,
      t: 'content',
      start: 1,
      num: 100,
      f: 'json',
      sortOrder: 'asc',
      sortField: 'type'
    };

    portalController.getPortalMapInfo(function (mapId) {
      mapController.createMap("mapDiv", mapId);
    });

    portalController.getItems(qParams, limit, function (itemsArr) {
      //console.log(itemsArr.length);
      getItemsWithGeoExtent(itemsArr);
    });
  };

  function getItemsWithGeoExtent(itemsArr) {
    var itemsWithExtentsArr = [];

    if (itemsArr.length > 0) {
      array.forEach(itemsArr, function (item) {
        if (item.extent.length === 2) {
          itemsWithExtentsArr.push({ 'extent': item.extent, 'id': item.id, 'type': item.type, 'access': item.access, 'thumbnailUrl': item.thumbnailUrl });
        };
      });
      mapController.addExtentsToMap(itemsWithExtentsArr);
    };
    
  };

  function getItemsForPunchCard() {
    var orgId = portalController.getPortalOrgId();
    var endDate = datesmodule.getTodayValue();
    var startDate = datesmodule.getDateFromDaysAgo(config.punchCardDaysAgoVal);
    endDate = "000000" + Math.floor(endDate.getTime() / 1000);
    startDate = "000000" + Math.floor(startDate.getTime() / 1000);

    var qParams = {
      q: 'modified:[' + startDate + ' TO ' + endDate + '] AND accountid:' + orgId,
      t: 'content',
      start: 1,
      num: 100,
      f: 'json',
      sortOrder: 'asc',
      sortField: 'type'
    };

    portalController.getItems(qParams, limit, function (itemsArr) {
      doCreatePunchValues(itemsArr);
    });

  };

  function doCreatePunchValues(itemsArr) {
    var punchCardValueStore = [];
    array.forEach(itemsArr, function (item) {
      var cardVal = {};
      var date = new Date(item.modified);
      var day = date.getDay();
      var hr = date.getHours();
      cardVal.d = day;
      cardVal.h = hr;
      punchCardValueStore.push(cardVal);
    });
    doPunchCardMixin(punchCardValueStore);
  };

  function doPunchCardMixin(punchCardValuesArr) {
    array.forEach(punchCardValuesArr, function (item, index) {
      var day = item.d;
      var hr = item.h;
      array.forEach(punchCardDataStore, function (cardValue) {

        if (day === cardValue.d && hr === cardValue.hour) {
          cardValue.count = cardValue.count + 1;
        };
      });
    });
    chartsmodule.getItemPunchCardChart(punchCardDataStore, "punchCardChartDiv");
  };





  function handleNavClick(e) {
    var selectedId = e.target.id;
    var divId;
    var oldActiveDiv = modelmodule.getActiveDiv();

    switch (selectedId) {
      case "popItemsBtn":
        divId = "itemGalleryContainer";
        modelmodule.setActiveDiv(divId);
        break;
      case "popItemsGeoBtn":
        divId = "itemReviewerContainer";
        modelmodule.setActiveDiv(divId);
        break;
      case "punchCardBtn":
        divId = "punchCardContainer";
        modelmodule.setActiveDiv(divId);
        break;
      case "tagMgrBtn":
        divId = "tagMgrContainer";
        modelmodule.setActiveDiv(divId);
        break;
      case "tagVizBtn":
        divId = undefined;
        break;
      case "svcHealthBtn":
        divId = undefined;
        break;
      case "aoaBtn":
        divId = undefined;
        break;
      default:
        divId = undefined;
    };

    if (oldActiveDiv !== divId) {
      doUpdateVisibleDiv(divId, oldActiveDiv);
    };

  };

  function doUpdateVisibleDiv(divId, oldActiveDiv) {
    if (oldActiveDiv) {
      viewController.updateDivElementDisplayStyle(oldActiveDiv, 'none');
    };

    if (divId) {
      viewController.updateDivElementDisplayStyle(divId, 'block');
      handleActiveViewCreation(divId);
    };
    
  };

  function handleActiveViewCreation(divId) {
    //console.log(divId);
    if (divId === "itemGalleryContainer") {
      //getUserItems();

    } else if (divId === "punchCardContainer") {
      getItemsForPunchCard();
    } else if (divId === "tagMgrContainer") {
      console.log('show tag manager');
    } else if (divId === "itemReviewerContainer") {
      getItemsForMap();
    } else {
      console.log('divid not found', divId);
    };

  };

  function doCreatePunchCardDataStoreTemplate() {
    var dIndex = 7;
    var hIndex = 24;

    for (var i = 0, j = hIndex; i < j; i++) {
      for (var m = 0, n = dIndex; m < n; m++) {
        punchCardDataStore.push({
          'd': m, 'hour': i, 'count': 0, 'day': function () {
            var tmp = dayStringLookupStore.query({ dVal: m });
            return tmp[0].dStrVal;
          }()
        });
      };
    };
  };

  function doCreateDayStringValStore(callback) {
    dayStringLookupStore = new Memory({
      data: [
        {'dVal': 0, 'dStrVal': 'Sun'},
        {'dVal': 1, 'dStrVal': 'Mon'},
        {'dVal': 2, 'dStrVal': 'Tue'},
        {'dVal': 3, 'dStrVal': 'Wed'},
        {'dVal': 4, 'dStrVal': 'Thu'},
        {'dVal': 5, 'dStrVal': 'Fri'},
        {'dVal': 6, 'dStrVal': 'Sat'}
        ]
    });
    callback(true);
  };

  function handleLayerInputClick(e) {
    var layerStateObj = {};
    layerStateObj.id = e.target.id;
    layerStateObj.show = e.target.checked;
    mapController.updateLayerState(layerStateObj);
  };

  function handleItemsViewBtnClick(e) {
    console.log(e.target.id);
    var selectedId = e.target.id;
    var qParams;

    var orgId = portalController.getPortalOrgId();
    var endDate = datesmodule.getTodayValue();
    var startDate = datesmodule.getDateFromDaysAgo(config.punchCardDaysAgoVal);
    endDate = "000000" + Math.floor(endDate.getTime() / 1000);
    startDate = "000000" + Math.floor(startDate.getTime() / 1000);

    qParams = {
      q: 'modified:[' + startDate + ' TO ' + endDate + '] AND accountid:' + orgId,
      t: 'content',
      start: 1,
      num: 100,
      f: 'json',
      sortField: "numViews",
      sortOrder: "desc"
    };

    switch (selectedId) {
      case "recentBtn":
        qParams.q = 'modified:[' + startDate + ' TO ' + endDate + '] AND accountid:' + orgId;
        qParams.sortField = "numViews";
        qParams.sortOrder = "desc";
        break;
      case "popBtn":
        qParams.q = 'accountid:' + orgId;
        qParams.sortField = "numViews";
        qParams.sortOrder = "desc";
        break;
      case "lessPopBtn":
        qParams.q = 'accountid:' + orgId;
        qParams.sortField = "numViews";
        qParams.sortOrder = "asc";
        break;
      case "trendBtn":
        qParams.q = 'accountid:' + orgId;
        qParams.sortField = "numViews";
        qParams.sortOrder = "desc";
        break;
      case "oldBtn":
        qParams.q = 'accountid:' + orgId;
        qParams.sortField = "created";
        qParams.sortOrder = "asc";
        break;
      case "newBtn":
        qParams.q = 'accountid:' + orgId;
        qParams.sortField = "created";
        qParams.sortOrder = "desc";
        break;
    }

    //console.log(qParams);
    getItemsForGalleryView(qParams);



  };

});