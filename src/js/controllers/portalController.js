define([
  "dojo/ready",
  "dojo/on",
  "dojo/_base/array",
  "esri/arcgis/Portal",
  "esri/request",
  "esri/config",
  "config/config"
], function (ready, on, array, esriPortal, esriRequest, esriConfig, config) {

  var portal = { };
  var pObj;
  var p;

  ready(function () {
    //console.log('portal module ready');
  });

  portal.getPortalObject = function () {
    return pObj;
  };

  portal.createPortalObj = function (configUrl, callback) {
    p = new esriPortal.Portal(configUrl);
    on(p, 'load', function(){
      p.signIn().then(function (portalUser) {
        pObj = portalUser.portal;
        esriConfig.defaults.io.corsEnabledServers.push( pObj.urlKey + "." + pObj.customBaseUrl );
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

  portal.getItems = function (qParams, numItems, callback) {
    var itemsRespArr = [];
    var params = qParams;

    if (numItems < 100) {
      params.num = numItems;
    };

    doQueryItems(params);

    function doQueryItems(params) {
      p.queryItems(params)
      .then(function (items) {
        array.forEach(items.results, function (item) {
          itemsRespArr.push(item);
        });

        if (items.nextQueryParams.start > -1 && items.nextQueryParams.start < numItems ) {
          doQueryItems(items.nextQueryParams);
        } else {
          callback(itemsRespArr);
        };

      });
    };
  };

  portal.getPortalOrgId = function () {
    return pObj.id;
  };

  portal.getPortalMapInfo = function (callback) {
    callback(pObj.defaultBasemap.id);
  };

  portal.getBaseUrl = function () {
    return pObj.urlKey + "." + pObj.customBaseUrl;
  }

  portal.updateItemThumbnail = function (itemId, itemObj) {
    var updateItemUrl;
    var tagsArr;
    var tagsStr;
    var updateObj;

    //console.log('ITEM OBJ', itemObj);

    var folderId = doCheckItemFolderInfo(itemObj.id);
    console.log('FOLDER ID', folderId);


    tagsArr = itemObj.tags;
    //console.log(tagsArr.length);

    adminTagExists = tagsArr.indexOf(config.adminKeyword);
    if (adminTagExists === -1) {
      tagsArr.push(config.adminKeyword);
    };

    //console.log(tagsArr.length);

    tagsStr = tagsArr.toString();
    updateItemUrl = window.location.protocol + "//" + portal.getBaseUrl() + "/sharing/rest/content/users/" + itemObj.owner + "/items/" + itemId + "/update?f=json";
    updateObj = { thumbnailUrl: config.adminThumbnailUrl, tags: tagsStr };
    //doUpdateItemInfo(updateItemUrl, updateObj);
  };

  function doUpdateItemInfo(updateItemUrl, updateObj) {
    var updateReq = esriRequest({
        url: updateItemUrl,
        content: updateObj
      }, {
        usePost: true
      }).then(function (result) {
        //success
        console.log(result);
      }, function (err) {
        //fail silently
    });
  };

  function doCheckItemFolderInfo(itemId) {

    //sharing/rest/content/items/:itemId
    var qParams = {
      f: 'json'
    };

    var url = window.location.protocol + "//" + portal.getBaseUrl() + "/sharing/rest/content/items/" + itemId;

    var getFolderInfo = esriRequest({
      url: url,
      content: qParams
    }).then(function (result) {
      console.log(result.ownerFolder);
      return result.ownerFolder;
    }, function (err) {
      //fail silently
    });

    
    
  }
  


  return portal;
});