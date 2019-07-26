import React from 'react';
import L from 'leaflet';
import CountyMap from './vermont-county-map.gif';


/** Styles **/
const mapStyle = {
  width: '70%',
  height: '600px',
  margin: '1% 3%',
  padding: '0',
  border: '2px solid black',
  zIndex: '0'
};
const borderStyle = {
  color: "#ff7805",
  weight: 5,
  opacity: 1,
  fillOpacity: 0,
};
const countyMapStyle = {
  height: '600px',
  marginRight: '3%',
  border: "2px solid black"
};
const divStyle = {
  display: 'flex',
  alignItems: "center"
}


/** Map Component**/

class Map extends React.Component {

  // this is called when a component is mounted to the DOM
  componentDidMount() {
    // create map
    this.map = L.map('map', {   // set to id='map'
      center: [43.88281, -72.69156],  // set center position to vermont lat/long
      minZoom: 8,
      maxZoom: 8,
      zoom: 8,         // set the zoom value fixed at 8
      layers: [   // set the layer that the map will use to display
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA,USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }), // can add more layers
      ]
    });

    

    
  

    // add marker to the markerPosition passed in as a prop
    this.marker = L.marker(this.props.markerPosition).addTo(this.map);

    console.log(this.props.borderLayer);
    // get borderLayer from props and add to the map
    this.VTBorder = this.props.borderLayer;
    this.VTBorder.addTo(this.map);
    this.VTBorder.setStyle(borderStyle);

    // const countyBorder = L.geoJSON(CountyData, {style: myStyle}).addTo(this.map);
  }

  // this is called when there is a prop or a state change
  componentDidUpdate({ markerPosition }) {
    // check if position has changed
    if (this.props.markerPosition !== markerPosition) {
      // set latlng of marker if it is different
      this.marker.setLatLng(this.props.markerPosition);
      // if the game is started, set the maps zoom and center
      this.map.setMinZoom(18);
      this.map.setMaxZoom(18);
      this.map.setZoom(18);
      this.map.panTo(this.props.markerPosition);
      this.props.polyline.addTo(this.map);
    }
  }

  render() {
    return (
      <div style={divStyle}>
        <div id='map' style={mapStyle}></div>
        <img src={CountyMap} alt={"County Map"} style={countyMapStyle} />
      </div>
    );
  }

}

export default Map;