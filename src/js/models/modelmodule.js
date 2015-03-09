define([
  "dojo/ready"
], function (ready) {

  var model = {};
  var credentialObj = {};
  var activeDiv = "";




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

  /*
  model.getOrgId = function () {
    return pObj.id;
  };
  */

  return model;

});