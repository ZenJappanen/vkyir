var express = require('express');
var imageRouter = express.Router();
var gm = require('gm');
var fs = require('fs');
var thumb = require('node-thumbnail').thumb;

// let path = `${file}`;
/* let thumb = gm(path).thumb(250, 250, `${__dirname}/images/${id}/thumbs/${file}`, 75, function (err, data) {
    if (err) throw err;
    console.log("Done!");
}); */

/* Get images */
imageRouter.get('/:id', (req, res) => {
    let id = req.params.id;
    let images = [];

    if (typeof id === 'string') {
        let files = fs.readdirSync(`${__dirname}/images/${id}`);
        files.forEach(file => {

            if (!file.includes('thumb_') && files.indexOf(`thumb_${file}`) === -1) {

                thumb({
                    source: `${__dirname}/images/${id}/${file}`,
                    destination: `${__dirname}/images/${id}`,
                    prefix: 'thumb_',
                    suffix: '',
                    concurrency: 2,
                    skip: true,
                    overwrite: false,
                    width: 160
                }).then(() => {
                    images.push(file);
                    images.push(`thumb_${file}`)
                }).catch(err => {
                    console.log('Error', err.toString());
                });
            }

            else {
                images.push(file);
            }
        });

        res.status(200).send(images);

    } else {
        res.status(400).send({ message: 'Hakemastasi kohteesta ei ole tietoja' });
    }

});

module.exports = imageRouter;