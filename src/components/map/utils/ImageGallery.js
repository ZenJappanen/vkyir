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
        images: [],
        metaData: ''
    }

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
                        caption: image.meta
                    })
                )
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.imageData !== this.props.imageData) {
            return {
                imageData: this.props.imageData,
                images: this.props.imageData.length > 0 && this.props.imageData.map(
                    image => ({
                        src: `${URL}/${image.folder}/${image.src}`,
                        thumbnail: `${URL}/${image.folder}/${image.thumb}`,
                        thumbnailWidth: 140,
                        thumbnailHeight: 70,
                        rowHeight: 120,
                        caption: image.meta
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