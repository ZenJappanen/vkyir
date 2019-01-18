import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import EsriJSON from "ol/format/EsriJSON.js";
import { tile as tileStrategy } from "ol/loadingstrategy.js";
import { createXYZ } from "ol/tilegrid.js";

import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";

//Spatial Reference: 102139  (3067)
var serviceUrl =
  "https://services.arcgis.com/eOoJrX8K8DfwR6Ct/arcgis/rest/services/VemalaKuormitusFosforiIKAALINEN/FeatureServer/";

var layer = "1";

var esrijsonFormat = new EsriJSON();

let style = feature => {
  const { PitP_ug_l } = feature.values_;

  let baseStyle = new Style({
    fill: new Fill({
      color: "rgba(192,192,192,0.22)"
    }),
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.66)",
      width: 1
    })
  });

  /*
  0,01 - 20 -> rgb(191,233,255)
  20,01 - 30 -> rgb(129,186,227)
  30,01 - 50 -> rgb(77,141,201)
  50,01 - 100 -> rgb(33,96,173)
  100,01 - 310 -> rgb(0,57,148) */

  switch (PitP_ug_l) {
    case "0,01 - 20":
      baseStyle.setFill(new Fill({ color: "rgba(192,192,192,0.22)" }));
      baseStyle.setStroke(
        new Stroke({ color: "rgba(192,192,192, 0.66)", width: 1 })
      );
      break;
    case "20,01 - 30":
      baseStyle.setFill(new Fill({ color: "rgba(129,186,227,0.22)" }));
      baseStyle.setStroke(
        new Stroke({
          color: "rgba(129,186,227, 0.66)",
          width: 1
        })
      );
      break;
    case "30,01 - 50":
      baseStyle.setFill(new Fill({ color: "rgba(77,141,201,0.22)" }));
      baseStyle.setStroke(
        new Stroke({
          color: "rgba(77,141,201, 0.66)",
          width: 1
        })
      );
      break;
    case "50,01 - 100":
      baseStyle.setFill(new Fill({ color: "rgba(33,96,173,0.22)" }));
      baseStyle.setStroke(
        new Stroke({
          color: "rgba(33,96,173, 0.66)",
          width: 1
        })
      );
      break;
    case "100,01 - 310":
      baseStyle.setFill(new Fill({ color: "rgba(0,57,148,0.22)" }));
      baseStyle.setStroke(
        new Stroke({
          color: "rgba(0,57,148, 0.66)",
          width: 1
        })
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

const Fosforit = new VectorLayer({
  source: vectorSource,
  name: "Fosforit",
  title: "Fosforit",
  visible: true,
  style: style,
  description: `Kartalla esitetyt vesistöjen .`
});

export default Fosforit;
