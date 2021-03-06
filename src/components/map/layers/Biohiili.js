import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import EsriJSON from "ol/format/EsriJSON.js";
import { tile as tileStrategy } from "ol/loadingstrategy.js";
import { createXYZ } from "ol/tilegrid.js";

import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";

//Spatial Reference: 102139  (3067)

//"https://services.arcgis.com/eOoJrX8K8DfwR6Ct/arcgis/rest/services/VemalaKuormitusFosforiIKAALINEN/FeatureServer/";
var serviceUrl =
  "https://services.arcgis.com/eOoJrX8K8DfwR6Ct/arcgis/rest/services/IkaalistenReittiBiohili/FeatureServer/";

var layer = "0";

var esrijsonFormat = new EsriJSON();

let style = feature => {
  //console.log(feature);
  const { Biohiili } = feature.values_;

  let baseStyle = new Style({
    fill: new Fill({
      color: "rgba(192,192,192,0)"
    }),
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0)",
      width: 1
    })
  });

  /*
  "Biohiilen ei ole sallittua" -> rgba( 255, 0, 0, 1.00 ) #FF0000
  "Biohiilen on sallittua" -> rgba( 220, 220, 0, 1.00 ) #dcdc00
  "Biohiilen on suositeltavaa" -> rgba( 0, 200, 0, 1.00 ) #00c600
  */
  switch (Biohiili) {
    case "Biohiilen levitys ei ole sallittua":
      baseStyle.setFill(new Fill({ color: "rgba(255, 0, 0,0.22)" }));
      baseStyle.setStroke(
        new Stroke({ color: "rgba(255, 0, 0, 0.66)", width: 1 })
      );
      break;
    case "Biohiilen levitys on sallittua":
      baseStyle.setFill(new Fill({ color: "rgba(220, 220, 0,0.22)" }));
      baseStyle.setStroke(
        new Stroke({ color: "rgba(220, 220, 0, 0.66)", width: 1 })
      );
      break;
    case "Biohiilen levitys on suositeltavaa":
      baseStyle.setFill(new Fill({ color: "rgba(0, 200, 0,0.22)" }));
      baseStyle.setStroke(
        new Stroke({ color: "rgba(0, 200, 0, 0.66)", width: 1 })
      );
      break;
  }

  return baseStyle;
};

const vectorSource = new VectorSource({
  loader: function(extent, resolution, projection) {
    var url =
      serviceUrl +
      layer +
      "/query/?f=json&" +
      "returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=" +
      encodeURIComponent(
        '{"xmin":' +
          extent[0] +
          ',"ymin":' +
          extent[1] +
          ',"xmax":' +
          extent[2] +
          ',"ymax":' +
          extent[3] +
          ',"spatialReference":{"wkid":102139}}'
      ) +
      "&geometryType=esriGeometryEnvelope&inSR=102139&outFields=*" +
      "&outSR=102139";

    fetch(url)
      .then(response => response.text())
      .then(response => {
        var features = esrijsonFormat.readFeatures(response, {
          featureProjection: projection
        });
        if (features.length > 0) {
          vectorSource.addFeatures(features);
        }
      })
      .catch(err => console.log(err));
  },
  strategy: tileStrategy(
    createXYZ({
      tileSize: 512
    })
  )
});

const Biohiili = new VectorLayer({
  source: vectorSource,
  name: "Biohiili",
  title: "Biohiili",
  visible: false,
  style: style,
  description: `KOTOMA paikkatietoanalyysilla arvioitu peltolohkojen soveltuvuus biohiilen levitykseen Ikaalisten reitin alueella.<br>
  Analyysi pohjautuu vuoden 2017 peltolohkoaineistoon, vuoden 2018 Rusle aineistoon, sekä sen ympäristöhallinnon aineistoihin. <br>
  Huomioitava aineistoa tulkittaessa! Aineisto on suuntaa antava. Analyysissä, jossa aineisto on tuotettu, tulee aina koko peltolohko luokitetuksi tiettyyn luokkaan, jos jokin osa peltolohkosta täyttää analyysissä käytettävät kriteerit. `
});

export default Biohiili;
