import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Gallery from 'react-grid-gallery';

const URL = `https://tieto.pirkanmaa.fi/ikaalinen/images/`;
const styles = {
    img: {
        width: '300px',
        maxWidth: '300px'
    },
    gallery: {
        width: '300px',
        maxWidth: '300px'
    }
}

class ImageGallery extends Component {

    state = {
        imageData: [],
        images: []
    }

    getMeta = image => {
        let url = 'https://tieto.pirkanmaa.fi/geoserver/pirely/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pirely:vesty_images_meta&outputFormat=application/json'
        fetch(url).then(
            response => response.json()
        ).then(
            metaData => metaData.filter(
                meta => parseInt(meta.kohde, 10) === parseInt(image.folder, 10)).map(
                    data => {
                        return `Kohteen kuvaaja(t): ${data.authors.length === 1 ? data.authors[0] : [...data.authors]}, ajankohta: ${data.startDate ? data.startDate + '-' + data.endDate : data.endDate}.`
                    })
        )
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.imageData !== prevState.imageData) {
            return {
                imageData: nextProps.imageData,
                images: nextProps.imageData.length > 0 && nextProps.imageData.map(
                    image => ({
                        src: `${URL}/${image.folder}/${image.src}`,
                        thumbnail: `${URL}/${image.folder}/${image.thumb}`,
                        thumbnailWidth: 140,
                        thumbnailHeight: 70,
                        rowHeight: 120,
                        caption: getMeta(image)
                    })
                )
            }
        }
    }

    render() {

        const { classes } = this.props;

        return (
            <div className={classes.gallery}>
                {this.state.images.length > 0 ?
                    <Gallery
                        images={this.state.images}
                        enableImageSelection={false}
                        showLightboxThumbnails={true}
                    /> :
                    <Typography>Kohteesta ei ole kuvia saatavilla.</Typography>
                }
            </div>
        );
    }
}

export default withStyles(styles)(ImageGallery);