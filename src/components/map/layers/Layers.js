import Kuntarajat from './../../../ikaalinen/Kuntarajat';
import Rusle from './../../../ikaalinen/Rusle';
import Vesty from './../../../ikaalinen/Vesty';
import Grid250m from './Grid250m';

/* Choose basemaps */
let Layers = [Grid250m];

/* This converts the above basemap array into an array of objects with keys "layer, name, title" with values from map layers */
function convert(array) {
    return array.reduce((acc, layer) => {

        acc.push({
            layer: layer,
            name: layer.getProperties().name,
            title: layer.getProperties().title,
            visibility: layer.getProperties().visible
        }); return acc;
    }, [])
}

export default Layers = convert(Layers);