define([
  "dojo/ready",
  "dojo/store/Memory",
  "dojo/_base/array"
], function (ready, Memory, array) {

  var model = {};
  var credentialObj = {};
  var activeDiv = "";
  var orgItemsStore;




  ready(function () {

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
    console.log('store fired');
    itemsStore = new Memory({ data: itemsArr, idProperty: 'id' });
    callback(itemsStore.data);
  };

  /*
  model.getOrgId = function () {
    return pObj.id;
  };
  */

  return model;

});