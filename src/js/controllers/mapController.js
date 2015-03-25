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

  //var itemExtentGL = new GraphicsLayer();
  var itemExtentGL;
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
    minPixelIntensity: 0
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

    

    itemExtentHeatmapLayerDefinition = maputils.getItemExtentCenterLayerDefinition();
    itemExtentHeatmapFeatureCollection = maputils.getItemExtentCenterFeatureCollection();
    itemExtentHeatmapFeatureCollection.layerDefinition = itemExtentHeatmapLayerDefinition;



    itemExtentCenterFeatureLayer = new FeatureLayer(itemExtentCenterFeatureCollection, {
      id: "itemCenterLayer",
      infoTemplate: itemPopupWindow
    });


    itemExtentHeatmapFeatureLayer = new FeatureLayer(itemExtentHeatmapFeatureCollection, {
      id: "itemHeatmapLayer",
      infoTemplate: itemPopupWindow
    });

    itemExtentGL = new GraphicsLayer({
      id: "itemExtentsGraphicsLayer",
      infoTemplate: itemPopupWindow
    });


    on(itemExtentCenterFeatureLayer, "click", function (evt) {
      //console.log(evt);
      console.log(itemExtentGL);
      console.log(evt.graphic);
      console.log(evt.graphic.attributes.id);
      //itemsMap.infoWindow.setFeatures([evt.graphic]);
    });

    on(itemExtentHeatmapFeatureLayer, "click", function (evt) {
      console.log(evt);
      //console.log(evt.graphic.attributes.id);
      itemsMap.infoWindow.setFeatures([evt.graphic]);
    })

  };

  map.addExtentsToMap = function (extentsArr) {
    array.forEach(extentsArr, function (item) {
      var itemExtent = maputils.getItemExtent(item.extent);
      var itemCenterPoint = itemExtent.getCenter();

      var area = itemExtent.getWidth() * itemExtent.getHeight();

      var itemHeatmapLayerGraphic = new Graphic();
      itemHeatmapLayerGraphic.setGeometry(itemCenterPoint);

      var itemExtentGraphic = new Graphic();
      itemExtentGraphic.setGeometry(itemExtent);
      itemExtentGraphic.setSymbol(itemExtentSym);

      /*
      if (area < 51200) {
        itemExtentGL.add(itemExtentGraphic);
      }
      */

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

      itemExtentGraphic.setAttributes(itemAttr);
      itemHeatmapLayerGraphic.setAttributes(itemAttr);
      //itemExtentGraphic.setAttributes(itemAttr);
      

      itemExtentGL.add(itemExtentGraphic);
      itemExtentCenterFeatureLayer.add(itemCenterPointGraphic);
      itemExtentHeatmapFeatureLayer.add(itemHeatmapLayerGraphic);

      //itemHeatmapLayerGraphic.setAttributes(itemAttr);

    });

    itemExtentHeatmapFeatureLayer.setRenderer(heatmapRenderer);
    itemsMap.addLayers([itemExtentCenterFeatureLayer, itemExtentGL, itemExtentHeatmapFeatureLayer]);
    //itemsMap.addLayer(itemExtentCenterFeatureLayer);
    //itemsMap.addLayer(itemExtentHeatmapFeatureLayer);
    //extentsCenterPointGraphicsLayer.hide();
    itemExtentHeatmapFeatureLayer.opacity = 0.65;
    console.log(itemExtentCenterFeatureLayer.opacity);
  };

  map.updateLayerState = function (layerStateObj) {
    //console.log(layerStateObj.id);
    if (layerStateObj.id === "polyLayer") {
      if(layerStateObj.show){
        itemExtentGL.show();
      } else {
        itemExtentGL.hide();
      }
    } else if(layerStateObj.id === "pointLayer") {
      if(layerStateObj.show){
        itemExtentCenterFeatureLayer.show();
      } else {
        itemExtentCenterFeatureLayer.hide();
      }
    } else {
      console.log('heatmap else fired', layerStateObj.id);
      if (layerStateObj.show) {
        itemExtentHeatmapFeatureLayer.show();
      } else {
        itemExtentHeatmapFeatureLayer.hide();
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