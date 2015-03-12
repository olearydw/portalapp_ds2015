define([
  "dojo/ready",
  "dojo/store/Memory",
  "dojo/_base/array"
], function (ready, Memory, array) {

  var model = {};
  var credentialObj = {};
  var activeDiv = "";
  var orgItemsStore;

  var orgThumbnail = "https://dl.dropboxusercontent.com/u/7480869/bckgrd.jpg";

  ready(function () {
    //console.log("model ready");
  });

  model.setCredentialObj = function (cObj) {
    credentialObj = cObj;
  };

  model.getCredentialObj = function () {
    return credentialObj;
  }

  model.destroyCredentialObj = function () {
    credentialObj = {};
  };

  model.setActiveDiv = function (divId) {
    activeDiv = divId;
  };

  model.getActiveDiv = function () {
    return activeDiv;
  };

  model.getConfigPortalUrl = function () {
    if (credentialObj) {
      return credentialObj.server;
    };
  };

  model.setItemsStore = function (itemsArr, callback) {
    itemsStore = new Memory({ data: itemsArr, idProperty: 'id' });
    callback(itemsStore.data);
  };

  model.getThumbnailInfo = function (iid, callback) {
    var itemInfo = itemsStore.query({ id: iid });
    var itemObj = itemInfo[0];
    itemObj.thumbnailUrl = orgThumbnail;
    itemsStore.put(itemInfo, { overwrite: true });
    callback(itemsStore.data);
  };

  return model;

});