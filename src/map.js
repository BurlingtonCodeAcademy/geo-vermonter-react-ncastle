import React from 'react';
import L from 'leaflet';
import BorderData from './border';
import CountyData from './vtCountyPolygons';

const style = {
  width: '100%',
  height: '600px'
}
var myStyle = {
  "color": "#ff7800",
  "weight": 5,
  "opacity": 0.65
};

// create a map component
class Map extends React.Component {

  // this is called when a component is mounted to the DOM
  componentDidMount() {
    // create map
    this.map = L.map('map', {   // set to id='map'
      center: [43.88281, -72.69156],  // set center position to vermont lat/long
      minZoom: 8,
      maxZoom: 8,
      zoom: 8,         // set the zoom value
      layers: [   // set the layer that the map will use to display
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }), // can add more layers
      ]
    });
  

    // add marker to the markerPosition passed in as a prop
    this.marker = L.marker(this.props.markerPosition).addTo(this.map);

    console.log(BorderData.geometry.coordinates);
    // add geoJSON for vermont border
    const VTBorder = L.geoJSON(BorderData).addTo(this.map);

    // const countyBorder = L.geoJSON(CountyData, {style: myStyle}).addTo(this.map);
  }

  // this is called when there is a prop or a state change
  componentDidUpdate({ markerPosition }) {
    // check if position has changed
    if (this.props.markerPosition !== markerPosition) {
      this.marker.setLatLng(this.props.markerPosition);
    }
  }

  render() {
    return <div id='map' style={style}></div>
  }

}

export default Map;