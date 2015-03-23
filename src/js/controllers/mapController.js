define([
	"dojo/ready",
  "dojo/_base/array",
  "dojo/on",
  "dojo/_base/Color",
  "esri/map",
  "esri/arcgis/utils",
	"esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
	"esri/SpatialReference",
  "esri/graphic",
	"esri/geometry/Extent",
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/PictureMarkerSymbol",
  "esri/renderers/HeatmapRenderer",
  "esri/styles/heatmap",
	"esri/layers/ArcGISTiledMapServiceLayer",
  "utils/maputils"
], function (ready, array, on, Color, Map, arcgisUtils, GraphicsLayer, FeatureLayer, SpatialReference, Graphic, Extent, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, PictureMarkerSymbol, HeatmapRenderer, esriStylesHeatmap, ArcGISTiledMapServiceLayer, maputils) {

  var map = {};
  var itemsMap;
  var itemsMapInitExtent;
  var spatialReference = new SpatialReference({ wkid: 4326 });

  var itemExtentSym;
  var itemExtentCenterSym;

  var itemExtentGL = new GraphicsLayer();
  var extentsCenterPointGraphicsLayer = new GraphicsLayer();

  var itemExtentCenterFeatureLayer;
  var itemExtentCenterLayerDefinition;
  var itemExtentCenterFeatureCollection;
  
  var itemExtentHeatmapLayerDefinition;
  var itemExtentHeatmapFeatureCollection;
  var itemExtentHeatmapFeatureLayer;
  
  //var heatmapRenderer = new HeatmapRenderer();

  var heatmapRenderer = new HeatmapRenderer({
    colors: ["rgba(0, 0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 0, 255)", "rgb(255, 0, 0)"],
    blurRadius: 12,
    maxPixelIntensity: 50,
    minPixelIntensity: 10
  });

  //extentsCenterPointGraphicsLayer
  

  map.createMap = function (divId, mapId, callback) {
    arcgisUtils.createMap(mapId, divId).then(function (response) {
      itemsMapInitExtent = new Extent(response.itemInfo.itemData.baseMap.baseMapLayers[0].resourceInfo.initialExtent);
      itemsMap = response.map;
      itemsMap.setExtent(itemsMapInitExtent);
      mapLoadedHandler();
      callback(true);
    });

  };

  function mapLoadedHandler() {
    itemExtentSym = maputils.getItemExtentSymbol();
    itemExtentCenterSym = maputils.getItemExtentCenterSymbol();


    itemPopupWindow = maputils.getItemInfoWindow();


    itemExtentCenterLayerDefinition = maputils.getItemExtentCenterLayerDefinition();
    itemExtentCenterFeatureCollection = maputils.getItemExtentCenterFeatureCollection();
    itemExtentCenterFeatureCollection.layerDefinition = itemExtentCenterLayerDefinition;
    itemExtentCenterFeatureLayer = new FeatureLayer(itemExtentCenterFeatureCollection, {
      id: "itemCenterLayer",
      infoTemplate: itemPopupWindow
    });

    itemExtentHeatmapLayerDefinition = maputils.getItemExtentCenterLayerDefinition();
    itemExtentHeatmapFeatureCollection = maputils.getItemExtentCenterFeatureCollection();
    itemExtentHeatmapFeatureCollection.layerDefinition = itemExtentHeatmapLayerDefinition;

    //console.log(itemExtentHeatmapLayerDefinition);
    //console.log(itemExtentHeatmapFeatureCollection);

    itemExtentHeatmapFeatureLayer = new FeatureLayer(itemExtentHeatmapFeatureCollection, {
      id: "itemHeatmapLayer"
    });


    on(itemExtentCenterFeatureLayer, "click", function (evt) {
      console.log(evt.graphic);
      itemsMap.infoWindow.setFeatures([evt.graphic]);
    })

  };

  map.addExtentsToMap = function (extentsArr) {
    array.forEach(extentsArr, function (item) {
      var itemExtent = maputils.getItemExtent(item.extent);
      var itemCenterPoint = itemExtent.getCenter();

      var itemHeatmapLayerGraphic = new Graphic();
      itemHeatmapLayerGraphic.setGeometry(itemCenterPoint);

      var itemExtentGraphic = new Graphic();
      itemExtentGraphic.setGeometry(itemExtent);
      itemExtentGraphic.setSymbol(itemExtentSym);

      var itemCenterPointGraphic = new Graphic(itemCenterPoint);
      itemCenterPointGraphic.setGeometry(itemCenterPoint);
      itemCenterPointGraphic.setSymbol(itemExtentCenterSym);
      var itemAttr = {};
      itemAttr.displayName = item.displayName;
      itemAttr.title = item.title || "Fake Title";
      itemAttr.id = item.id;
      itemAttr.access = item.access;
      itemAttr.iconUrl = item.iconUrl;
      itemAttr.name = item.name;
      itemAttr.numViews = item.numViews;
      itemAttr.owner = item.owner;
      itemAttr.thumbnailUrl = item.thumbnailUrl;
      //itemAttr.itemUrl = item.itemUrl;
      itemAttr.itemUrl = "http://foobar.com";

      itemCenterPointGraphic.setAttributes(itemAttr);

      itemExtentGL.add(itemExtentGraphic);
      itemExtentCenterFeatureLayer.add(itemCenterPointGraphic);
      itemExtentHeatmapFeatureLayer.add(itemHeatmapLayerGraphic);

    });

    itemExtentHeatmapFeatureLayer.setRenderer(heatmapRenderer);
    itemsMap.addLayer(itemExtentGL);
    itemsMap.addLayer(itemExtentCenterFeatureLayer);
    itemsMap.addLayer(itemExtentHeatmapFeatureLayer);
    //extentsCenterPointGraphicsLayer.hide();

    console.log(itemExtentCenterFeatureLayer);
  };

  map.updateLayerState = function (layerStateObj) {
    if(layerStateObj.id === "polyLayer"){
      if(layerStateObj.show){
        itemExtentGL.show();
      } else {
        itemExtentGL.hide();
      }
    } else {
      if(layerStateObj.show){
        itemExtentCenterFeatureLayer.show();
      } else {
        itemExtentCenterFeatureLayer.hide();
      }
    }
  };

  /*
  function calcCenterPoint(extentObj) {
    var centerPt = extentObj.getCenter();
    return centerPt;
  };
  */

  return map;
});