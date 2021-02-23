'use strict'

// let mymap;

require([
    "esri/map", 
    "esri/graphic",
    "esri/dijit/Directions",
    "esri/dijit/Print",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",

    "dojo/_base/Color",
    "dojo/_base/array",

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
     function(Map, Graphic, Directions, Print, SimpleMarkerSymbol, TextSymbol, Font,
        Color, array, Extent, arcgisUtils, Legend, Search, Locator, parser, ready, dom, on){

    parser.parse();

    // mymap = new Map ("mapa", {
    //     basemap: "topo",
    // });

    arcgisUtils.createMap('95a0746db08c4659a4b9aee3fc30b985', "mapa").then(function(response){

       var mapa = response.map;

       var legendLayers = arcgisUtils.getLegendLayers(response);

       var legend = new Legend({
        map: response.map,
        layerInfo: legendLayers,
        }, "leyenda");
       legend.startup();
    

    var buscador = new Search({
        map: mapa,
    }, "buscar");
    buscador.startup();

    //Constructor del task

    var localizador = new Locator (
        "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    );

    

    //Evento click. Ponemos el dom.ById porque estams con dojo

    on(dom.byId("localizar"), "click", doAddressToLocations);

    //Ejecutar la función

    function doAddressToLocations(){
        var objAddress = {
            "SingleLine" : dom.byId("taAddress").value
        };
    
        var params = {
            address: objAddress,
            outFields: ["*"],
        };
        localizador.addressToLocations(params) //Evento del locator//
    };

    //Evento de la API

    localizador.on("address-to-locations-complete", showResults);

    function showResults(candidates) {
        // Define the symbology used to display the results
        var symbolMarker = new SimpleMarkerSymbol();
        symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
        symbolMarker.setColor(new Color([255, 0, 0, 0.75]));
        var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Helvetica");

        // loop through the array of AddressCandidate objects
        var geometryLocation;
        array.every(candidates.addresses, function (candidate) {

            // if the candidate was a good match
            if (candidate.score > 80) {

                // retrieve attribute info from the candidate
                var attributesCandidate = {
                    address: candidate.address,
                    score: candidate.score,
                    locatorName: candidate.attributes.Loc_name
                };

                /*
                 * Step: Retrieve the result's geometry
                 */

                geometryLocation = candidate.location;


                /*
                 * Step: Display the geocoded location on the map
                 */

                var graphicResult = new Graphic(geometryLocation, symbolMarker, attributesCandidate);
                mapa.graphics.add(graphicResult);


                // display the candidate's address as text
                var sAddress = candidate.address;
                var textSymbol = new TextSymbol(sAddress, font, new Color("#FF0000"));
                textSymbol.setOffset(0, -22);
                mapa.graphics.add(new Graphic(geometryLocation, textSymbol));

                // exit the loop after displaying the first good match
                return false;
            }
        });

        // Center and zoom the map on the result
        if (geometryLocation !== undefined) {
            mapa.centerAndZoom(geometryLocation, 15);
        }
    }

        var direcciones = new Directions({
        map: mapa,
        routeTaskUrl: "https://utility.arcgis.com/usrsvcs/appservices/OM1GNiiACNJceMRn/rest/services/World/Route/NAServer/Route_World",

        }, "direcciones")
        direcciones.startup();

        var imprimir = new Print ({
            map: mapa,
            url: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute",
        }, dom.byId("imprimir"));
        imprimir.startup();

   });

});







