import React from 'react'
import { withStyles } from '@material-ui/core'
import { default as MaterialUiImage } from 'material-ui-image'
import InnerImageZoom from 'react-inner-image-zoom'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css'

const Image = ({
  src,
  zoomSrc,
  hasZoomFeature = false,
  zoomFeatureProps = {},
  ...props
}) => {
  if (hasZoomFeature) {
    return (
      <InnerImageZoom
        src={src}
        zoomSrc={zoomSrc}
      />)
  }

  return (
    <MaterialUiImage src={src} {...props} />
  )
}

const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(Image)
