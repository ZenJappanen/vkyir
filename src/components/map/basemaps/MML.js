import proj4 from 'proj4';
import Projection from 'ol/proj/Projection';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {getWidth, getTopLeft} from 'ol/extent.js';
import Tile from 'ol/layer/Tile';
import WMTS from 'ol/source/WMTS';
import TileWMS from 'ol/source/TileWMS';

proj4.defs( 'EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs' );
const proj = new Projection({
  code: 'EPSG:3067',
  extent: [-548576,6291456,1548576,8388608]
});

let projectionExtent = proj.getExtent(),
    size = getWidth(projectionExtent) / 256,
    resolutions = new Array(16),
    matrixIds = new Array(16),
    matrixIdsMML = new Array(16);

for (var z = 0; z < 16; z++) {
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = 'EPSG:3067:' + z;
  matrixIdsMML[z] = z;    
}

const mml_tilegrid = new WMTSTileGrid({
  origin: getTopLeft(projectionExtent),
  resolutions: resolutions,
  matrixIds: matrixIdsMML  
})

const mml_source = new WMTS({
  url: 'http://avoindata.maanmittauslaitos.fi/mapcache/wmts/',
  layer: '',
  matrixSet: 'ETRS-TM35FIN',
  format: 'image/png',
  transitionEffect:'resize',
  gutter:0,buffer:0,
  projection: 'EPSG:3067',
  style: 'default',
  tileGrid: mml_tilegrid
});

const taustakartta = new Tile({
  title: ' Taustakartta (MML)',
  name: 'Taustakartta',
  opacity: 0.33,
  visible: true,
  type: 'base',
  source: new WMTS({
    url: 'http://avoindata.maanmittauslaitos.fi/mapcache/wmts/',
    layer: 'taustakartta',
    matrixSet: 'ETRS-TM35FIN',
    format: 'image/png',
    transitionEffect:'resize',
    gutter:0,buffer:0,
    projection: 'EPSG:3067',
    style: 'default',
    tileGrid: mml_tilegrid
  })
});

const maastokartta = new Tile({
  title: ' Maastokartta (MML)',
  name: 'Maastokartta',
  opacity: 0.33,
  visible: false,
  type: 'base',
  source: new WMTS({
    url: 'http://avoindata.maanmittauslaitos.fi/mapcache/wmts/',
    layer: 'maastokartta',
    matrixSet: 'ETRS-TM35FIN',
    format: 'image/png',
    transitionEffect:'resize',
    gutter:0,buffer:0,
    projection: 'EPSG:3067',
    style: 'default',
    tileGrid: mml_tilegrid
  })
});

const ilmakuva = new Tile({
  title: ' Ilmakuva (MML)',
  name: 'Ilmakuva',
  opacity: 0.75,
  visible: false,
  type: 'base',
  source: new TileWMS({
    url: 'http://tiles.kartat.kapsi.fi/ortokuva?',
    projection: 'EPSG:3067',
    matrixSet: 'ETRS-TM35FIN',
    format: 'image/png',
    tileGrid: mml_tilegrid
  })
});

export {maastokartta, taustakartta, ilmakuva};