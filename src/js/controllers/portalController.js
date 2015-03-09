define([
  "dojo/ready",
  "dojo/on",
  "dojo/_base/array",
  "esri/arcgis/Portal"
], function (ready, on, array, esriPortal) {

  var portal = { };
  var pObj;
  var p;




  ready(function () {
    console.log('portal module ready');
  });

  portal.getPortalObject = function () {
    return pObj;
  };

  portal.createPortalObj = function (configUrl, callback) {
    p = new esriPortal.Portal(configUrl);
    on(p, 'load', function(){
      p.signIn().then(function (portalUser) {
        pObj = portalUser.portal;
        console.log(pObj);
      });
    });
  };

  portal.getUsersItems = function (callback) {
    var qParams = {
      q: "owner:" + pObj.user.username,
      sortField: "numViews",
      sortOrder: "desc",
      num: 20
    };
    p.queryItems(qParams).then(
      function (items) {
        callback(items);
      });
  };

  portal.getPunchcardItems = function (qParams, callback) {
    var itemsResponseArr = [];
    var params = qParams;

    doRunItemQuery(params);

    function doRunItemQuery(params) {
      p.queryItems(params).then(
        function (items) {
          array.forEach(items.results, function (item) {
            itemsResponseArr.push(item);
          });

          if (items.nextQueryParams.start > -1) {
            doRunItemQuery(items.nextQueryParams);
          } else {
            callback(itemsResponseArr);
          };

      });
    };

    
    


  };

  portal.getPortalOrgId = function () {
    return pObj.id;
  };



  return portal;
});