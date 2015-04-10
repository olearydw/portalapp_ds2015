define([
	"dojo/ready",
  "dojo/_base/Color",
	"esri/SpatialReference",
  "esri/geometry/Geometry",
	"esri/geometry/Extent",
  "esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleLineSymbol",
  "esri/symbols/PictureMarkerSymbol",
  "esri/dijit/PopupTemplate"
], function (ready, Color, SpatialReference, Geometry, Extent, SimpleFillSymbol, SimpleLineSymbol, PictureMarkerSymbol, PopupTemplate) {
  var mapUtils = {};
  var spatialReference = new SpatialReference({ wkid: 4326 });



  mapUtils.getItemExtent = function (extentArr) {
    var xmin = Number(extentArr[0][0]);
    var ymin = Number(extentArr[0][1]);
    var xmax = Number(extentArr[1][0]);
    var ymax = Number(extentArr[1][1]);
    var extent = new Extent(xmin, ymin, xmax, ymax, spatialReference);
    return extent;
  };

  mapUtils.getItemExtentSymbol = function () {
    /*
    var sls;
    var sfs;
    sls = new SimpleLineSymbol('solid', new Color([225, 107, 23]), 0.06);
    sfs = new SimpleFillSymbol('solid', sls, new Color([225, 107, 23, 0.02]));
    return sfs;
    */
    extentSymbol = new SimpleFillSymbol("solid",
      new SimpleLineSymbol("solid", new Color([232, 104, 80]), 1),
      new Color([232, 104, 80, 0.05])
    );

    return extentSymbol;

  };

  mapUtils.getItemExtentCenterSymbol = function () {
    /*
    var pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
         new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 128, 0]), 4)
        );
    
    var pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
      new Color([0, 0, 0]), 1),
      new Color([0, 185, 242])
    );

    extentSymbol = new SimpleFillSymbol("solid",
      new SimpleLineSymbol("solid", new Color([232, 104, 80]), 1),
      new Color([232, 104, 80, 0.05])
    );

    centerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
      new Color([255, 255, 255]), 1),
      new Color([232, 104, 80, 0.75])
    );
    */

    var pointSymbol = new PictureMarkerSymbol('../src/assets/img/iMapPin.png', 12, 25);
    return pointSymbol;
  };

  /*
  mapUtils.getExtentCenterPoint = function (extent) {
    var centerPt = extent.getCenter();
    return centerPt;
  };
  */

  mapUtils.getItemExtentCenterLayerDefinition = function () {
    var layerDefinition = {
      "geometryType": "esriGeometryPoint",
      "fields": [{
        alias: "Object ID",
        type: "esriFieldTypeOID",
        name: "ObjectID"
      }]
    };
    return layerDefinition;
  };

  mapUtils.getItemExtentCenterFeatureCollection = function () {
    var featureCollection = {
      layerDefinition: null,
      featureSet: {
        features: [],
        geometryType: "esriGeometryPoint"
      }
    };
    return featureCollection;
  };

  mapUtils.getItemInfoWindow = function () {
    var popupTemplate = new PopupTemplate({
      title: "{title}",
      fieldInfos: [{
        fieldName: "owner",
        label: "Owner",
        visible: true
      }, {
        fieldName: "displayName",
        label: "Type",
        visible: true
      }, {
        fieldName: "id",
        label: "Item ID",
        visible: false
      }],
      mediaInfos: [{
        title: "",
        caption: "",
        type: "image",
        value: {
          sourceURL: "{thumbnailUrl}",
          linkURL: "{itemUrl}"
        }
      }]
    });
    return popupTemplate;
  };



  return mapUtils;
});