import React from 'react';
import { compose, withProps } from 'recompose';
import { Rectangle, withScriptjs, withGoogleMap, GoogleMap, Marker, OverlayView } from 'react-google-maps';
import mapStyle from './mapStyle.json';
import './index.css';

const GRID_STEPS = 100;

function getWorldCoords(gridBounds, gridCoords) {
  const vertStepSize = Math.abs(gridBounds.south - gridBounds.north) / GRID_STEPS;
  const horzStepSize = Math.abs(gridBounds.east - gridBounds.west) / GRID_STEPS;
  return {
    lat: gridBounds.north - (vertStepSize * gridCoords.get('y')),
    lng: gridBounds.west + (horzStepSize * gridCoords.get('x')),
  };
}

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
});

function MissionMap(props) {
  const { gridBounds, center, markers, onMarkerClick } = props;

  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={center}
      defaultOptions={{
        styles: mapStyle,
        disableDoubleClickZoom: true,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: false,
      }}
      clickableIcons
    >
      {markers.map((marker) => {
        const coords = marker.get('location');
        const typeAction = marker.get('type') || marker.get('action');
        const detected = marker.get('object_detected');
        return (
          <OverlayView
            key={marker.get('id')}
            position={getWorldCoords(gridBounds, coords)}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={getPixelPositionOffset}
          >
          <span className={`Pulse Pulse-${typeAction.toLowerCase()} Pulse-${detected ? 'detected' : 'not-detected'}`} onClick={(e) => onMarkerClick(marker)} />
          </OverlayView>
        );
      })}
    </GoogleMap>
  );
};

export default compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(MissionMap);
