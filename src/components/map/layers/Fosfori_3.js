import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import EsriJSON from "ol/format/EsriJSON.js";
import { tile as tileStrategy } from "ol/loadingstrategy.js";
import { createXYZ } from "ol/tilegrid.js";

import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";

//Spatial Reference: 102139  (3067)

/* VEMALA Metsakuorma Kg/Km2/v 12/2018 IKAALINEN */

var serviceUrl =
  "https://services.arcgis.com/eOoJrX8K8DfwR6Ct/arcgis/rest/services/VemalaKuormitusFosforiIKAALINEN/FeatureServer/";

var layer = "3";

var esrijsonFormat = new EsriJSON();

let style = feature => {
  const { Pelto_P_Kg_Km2_v } = feature.values_;

  let baseStyle = new Style({
    fill: new Fill({
      color: "rgba(192,192,192,0)"
    }),
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0)",
      width: 1
    })
  });

  /* olds
  0,01 - 10 -> rgba( 255, 255, 191, 1.00 ) #ffffbf
  10,01 - 20 -> rgba( 237, 231, 142, 1.00 ) #ede78e
  20,01 - 40 -> rgba( 219, 203, 99, 1.00 ) #dbcb63
  40,01 - 60 -> rgba( 201, 173, 60, 1.00 ) #c9ad3c
  60,01 - 80-> rgba( 184, 142, 28, 1.00 ) #b88e1c
  80,01 - 117,07-> rgba( 168, 112, 0, 1.00 ) #a87000
  PeltoPKg_Km2
  */

  /* new
  0,01 - 10 -> rgba( 204,  204,  140, 1.00 ) #CCCC8C
  10,01 - 20 -> rgba( 179,  179,  115, 1.00 ) #B3B373
  20,01 - 40 -> rgba( 153,  153,  89, 1.00 ) #999959
  40,01 - 60 -> rgba( 128,  128, 64, 1.00 ) #808040
  60,01 - 80-> rgba( 102,  102,  38, 1.00 ) #666626
  80,01 - 117,07-> rgba( 77,  77,  13, 1.00 ) #4D4D0D
  PeltoPKg_Km2
  */

  /* newer
  0,01 - 10 -> rgba( 220,  220,  102, 1.00 ) #DCDC66
  10,01 - 20 -> rgba( 220,  220,  51, 1.00 ) #DCDC33
  20,01 - 40 -> rgba( 220,  220,  0, 1.00 ) #DCDC00
  40,01 - 60 -> rgba( 204,  204, 0, 1.00 ) #CCCC00
  60,01 - 80-> rgba( 153,  153,  0, 1.00 ) #999900
  80,01 - 117,07-> rgba( 102,  102,  0, 1.00 ) #666600
  PeltoPKg_Km2
  */

  switch (Pelto_P_Kg_Km2_v) {
    case "0,01 - 10":
      baseStyle.setFill(new Fill({ color: "rgba(220,  220,  102,0.22)" }));
      baseStyle.setStroke(
        new Stroke({ color: "rgba(220,  220,  102, 0.66)", width: 1 })
      );
      break;
    case "10,01 - 20":
      baseStyle.setFill(new Fill({ color: "rgba(220,  220,  51,0.22)" }));
      baseStyle.setStroke(
        new Stroke({
          color: "rgba(220,  220,  51, 0.66)",
          width: 1
        })
      );
      break;
    case "20,01 - 40":
      baseStyle.setFill(new Fill({ color: "rgba(220,220,  0,0.22)" }));
      baseStyle.setStroke(
        new Stroke({
          color: "rgba(220,220,  0, 0.66)",
          width: 1
        })
      );
      break;
    case "40,01 - 60":
      baseStyle.setFill(new Fill({ color: "rgba(204,  204, 0,0.22)" }));
      baseStyle.setStroke(
        new Stroke({
          color: "rgba(204,  204, 0, 0.66)",
          width: 1
        })
      );
      break;
    case "60,01 - 80":
      baseStyle.setFill(new Fill({ color: "rgba(153,  153,  0,0.22)" }));
      baseStyle.setStroke(
        new Stroke({
          color: "rgba(153,  153,  0, 0.66)",
          width: 1
        })
      );
      break;
    case "80,01 - 117,07":
      baseStyle.setFill(new Fill({ color: "rgba( 102,  102,  0,0.22)" }));
      baseStyle.setStroke(
        new Stroke({
          color: "rgba( 102,  102,  0, 0.66)",
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

const Fosforit_peltokuorma = new VectorLayer({
  source: vectorSource,
  name: "Peltokuorma [Kg/Km2/v] 12/2018",
  title: "Peltokuorma [Kg/Km2/v] 12/2018",
  visible: false,
  style: style,
  description: `VEMALA-malli laskee alueella syntyvän, alueelle tulevan ja alueelta lähtevän kuormituksen arvoja peltoviljelylle, luonnonhuuhtoumalle pelloilta ja metsistä, metsätaloudelle (hakkuut, lannoitus, kunnostusojitus ja vanhat ojitetut suo), haja-asutukselle (vakituinen ja loma-asutus), hulevesille, laskeumalle sekä pistekuormitukselle. Hydrologiset arvot saadaan WSFS-vesistömallista, jonka jälkeen VEMALA laskee kuormituksen syntymistä maa-alueilta (pellot/muu alue), lisää eri lähteistä saatavia kuormitustietoja (haja-asutus, pistekuormitus, laskeuma, turvetuotanto) ja lopulta kuormituksen etenemisen ja pidättymisen vesistössä (sekoittuminen, sedimentoituminen, eroosio). Näiden laskennallisten tietojen avulla muodostuu laskennallinen pitoisuus järvissä tai uomissa esim. fosforipitoisuus.
  <br>Peltotalouden kuormitus kuvaa kussakin 4. jakovaiheen alueella syntyvää suhteellista vuosittaista kuormitusta maapinta-alaan nähden, kg/km2/v. 
  <br>Kaikki kuormitus- ja pitoisuusarvot perustuvat mallinnukseen eli vaikka malli pääosin tuottaakin melko luotettavia arvoja, niin poikkeustapauksissa tulokset saattavat erota paljonkin todellisuudesta. Tämän vuoksi on syytä tehdä alustava asiantuntija-arvio tulosten oikeellisuudesta.`
});

export default Fosforit_peltokuorma;
