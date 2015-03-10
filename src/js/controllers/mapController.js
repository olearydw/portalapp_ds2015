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
  "esri/renderers/HeatmapRenderer",
  "esri/styles/heatmap",
	"esri/layers/ArcGISTiledMapServiceLayer",
], function (ready, array, on, Color, Map, arcgisUtils, GraphicsLayer, SpatialReference, Graphic, Geometry, Extent, Polygon, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, HeatmapRenderer, esriStylesHeatmap, ArcGISTiledMapServiceLayer) {

  var map = {};
  var itemsMap;
  var itemsMapInitExtent;

  var extentSymbol;
  var extentsGraphicsLayer = new GraphicsLayer();

  var extentCenterSymbol;
  var extentsCenterPointGraphicsLayer = new GraphicsLayer();


  var spatialReference = new SpatialReference({ wkid: 4326 });

  var heatmapRenderer;

  var heatmapRenderer = new HeatmapRenderer();

  ready(function () {
    heatmapRenderer = new HeatmapRenderer({
      colors: ["rgba(0, 0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 0, 255)", "rgb(255, 0, 0)"],
      blurRadius: 12,
      maxPixelIntensity: 250,
      minPixelIntensity: 10
    });
  });

  map.createMap = function (divId, mapId) {
    extentSymbol = createExtentSymbol();
    extentCenterSymbol = createExtentCenterSymbol();

    arcgisUtils.createMap(mapId, divId).then(function (response) {
      itemsMapInitExtent = new Extent(response.itemInfo.itemData.baseMap.baseMapLayers[0].resourceInfo.initialExtent);
      itemsMap = response.map;
      itemsMap.setExtent(itemsMapInitExtent);
      itemsMap.on("extent-change", extentChangeHandler);
      //itemsMap.addLayer(extentsGraphicsLayer);
      //itemsMap.addLayer(extentsCenterPointGraphicsLayer);

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
    var pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 12,
         new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 128, 0]), 4)
        );
    return pointSymbol;
  };

  map.addExtentsToMap = function (extentsArr) {
    array.forEach(extentsArr, function (item) {
      var xmin = Number(item.extent[0][0]);
      var ymin = Number(item.extent[0][1]);
      var xmax = Number(item.extent[1][0]);
      var ymax = Number(item.extent[1][1]);

      var extent = new Extent(xmin, ymin, xmax, ymax, spatialReference);
      var extentGraphic = new Graphic();
      extentGraphic.setGeometry(extent);
      extentGraphic.setSymbol(extentSymbol);

      var centerPt = calcCenterPoint(extent);
      var extentCenterGraphic = new Graphic();
      extentCenterGraphic.setGeometry(centerPt);
      extentCenterGraphic.setSymbol(extentCenterSymbol);

      extentsGraphicsLayer.add(extentGraphic);
      extentsCenterPointGraphicsLayer.add(extentCenterGraphic);

      console.log('loop iterated');
    });

    console.log('loop done');

    console.log(heatmapRenderer);

    extentsCenterPointGraphicsLayer.setRenderer(heatmapRenderer);

    console.log(extentsCenterPointGraphicsLayer);

    itemsMap.addLayer(extentsGraphicsLayer);
    itemsMap.addLayer(extentsCenterPointGraphicsLayer);

    console.log('layer added to map');
    //extentsCenterPointGraphicsLayer.redraw();


    console.log(itemsMap);
    console.log(itemsMap.graphicsLayerIds);


    extentsGraphicsLayer.hide();



  };


  function calcCenterPoint(extentObj) {
    var centerPt = extentObj.getCenter();
    return centerPt;
  };

  map.updateLayerState = function (layerStateObj) {
    console.log(layerStateObj);
  };



  return map;
});