import React from 'react'
import { Box } from '@material-ui/core'
import { Helmet } from 'react-helmet'
import { withGoogleMap, withScriptjs, GoogleMap as ReactGoogleMap, Marker } from 'react-google-maps'

const GoogleMap = withScriptjs(withGoogleMap((props, map) => (
  <ReactGoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: map[0], lng: map[1] }}
  >
    {props.isMarkerShown && <Marker position={{ lat: map[0], lng: map[1] }} />}
  </ReactGoogleMap>
)))

const ContactMap = (props) => {
  return (
    <GoogleMap
      isMarkerShown
      googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo&callback=initMap&v=3.exp&libraries=geometry,drawing,places'
      loadingElement={<div style={{ height: '100%' }} />}
      containerElement={<div style={{ height: '100%' }} />}
      mapElement={<div style={{ height: '100%' }} />}
    />
  )
}

export default ContactMap
