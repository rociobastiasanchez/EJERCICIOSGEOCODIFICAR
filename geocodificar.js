'use strict'

// let mymap;

require([
    "esri/map", 
    "esri/graphic",
    "esri/geometry/Extent",
    "esri/arcgis/utils",  
    "esri/dijit/Legend",
    "esri/dijit/Search",
    "esri/tasks/locator",
    
    "dojo/parser", 
    "dojo/ready",
    "dojo/dom", 
    "dojo/on",
    
], 
     function(Map, Graphic, Extent, arcgisUtils, Legend, Search, Locator, parser, ready, dom, on){

    parser.parse();

    // mymap = new Map ("mapa", {
    //     basemap: "topo",
    // });

    arcgisUtils.createMap('95a0746db08c4659a4b9aee3fc30b985', "mapa").then(function(response){

       let mapa = response.map;

       var legendLayers = arcgisUtils.getLegendLayers(response);

       var legend = new Legend({
        map: response.map,
        layerInfo: legendLayers,
        }, "leyenda");
       legend.startup();
    });

    var buscador = new Search({
        map: mapa,
    }, "buscar");
    buscador.startup();

    //Constructor del task

    var localizador = new Locator (
        "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer"
    );

    //Preparar los parámetros 

    var params = {
        address: "Gran Via",
        outFields: ["*"],
    };


    //Evento click. Ponemos el dom.ById porque estams con dojo

    on(dom.byId("localizar"), "click", doAddressToLocations);

    //Ejecutar la función

    function doAddressToLocations(){
        localizador.addressToLocations(params) //Evento del locator//
    };


    //Evento de la API

    localizador.on("address-to-locations-complete", showResults);

    function showResults(){
        
    }







});
