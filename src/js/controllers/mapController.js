define([
	"dojo/ready",
  "dojo/_base/array",
  "dojo/on",
  "dojo/_base/Color",
  "esri/map",
  "esri/arcgis/utils",
	"esri/layers/GraphicsLayer",
	"esri/SpatialReference",
  "esri/graphic",
  "esri/geometry/Geometry",
	"esri/geometry/Extent",
	"esri/geometry/Polygon",
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
	"esri/layers/ArcGISTiledMapServiceLayer",
], function (ready, array, on, Color, Map, arcgisUtils, GraphicsLayer, SpatialReference, Graphic, Geometry, Extent, Polygon, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, ArcGISTiledMapServiceLayer) {

  var map = {};
  var itemsMap;
  var itemsMapInitExtent;

  var extentSymbol;
  var extentsGraphicsLayer = new GraphicsLayer();

  var extentCenterSymbol;
  var extentsCenterPointGraphicsLayer = new GraphicsLayer();


  var spatialReference = new SpatialReference({ wkid: 4326 });

  ready(function () {
    
  });

  map.createMap = function (divId, mapId) {
    extentSymbol = createExtentSymbol();
    extentCenterSymbol = createExtentCenterSymbol();

    arcgisUtils.createMap(mapId, divId).then(function (response) {
      itemsMapInitExtent = new Extent(response.itemInfo.itemData.baseMap.baseMapLayers[0].resourceInfo.initialExtent);
      itemsMap = response.map;
      itemsMap.setExtent(itemsMapInitExtent);
      itemsMap.on("extent-change", extentChangeHandler);
      itemsMap.addLayer(extentsGraphicsLayer);
      itemsMap.addLayer(extentsCenterPointGraphicsLayer);

    });

  };

  function extentChangeHandler(e) {
    var extent = e.extent, zoomed = e.levelChange;
  };

  function createExtentSymbol() {
    var sls;
    var sfs;
    sls = new SimpleLineSymbol('solid', new Color([225, 107, 23]), 1.00);
    sfs = new SimpleFillSymbol('solid', sls, new Color([225, 107, 23, 0.04]));
    return sfs;
  };

  function createExtentCenterSymbol() {
    var pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CROSS, 22,
         new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 128, 0]), 4)
        );
    return pointSymbol;
  };

  map.addExtentsToMap = function (extentsArr) {
    //console.log(extentsArr);
    array.forEach(extentsArr, function (item) {
      var xmin = Number(item.extent[0][0]);
      var ymin = Number(item.extent[0][1]);
      var xmax = Number(item.extent[1][0]);
      var ymax = Number(item.extent[1][1]);
      var extent = new Extent(xmin, ymin, xmax, ymax, spatialReference);

      var centerPt = calcCenterPoint(extent);

      var extentGraphic = new Graphic();
      extentGraphic.setGeometry(extent);
      extentGraphic.setSymbol(extentSymbol);

      var extentCenterGraphic = new Graphic();
      extentCenterGraphic.setGeometry(centerPt);
      extentCenterGraphic.setSymbol(extentCenterSymbol);




      //extentsGraphicsLayer.add(extentGraphic);
      extentsCenterPointGraphicsLayer.add(extentCenterGraphic);

    });
  };

  function calcCenterPoint(extentObj) {
    var centerPt = extentObj.getCenter();
    console.log(centerPt);

  };



  return map;
});