import React from 'react';
import ReactDOM from 'react-dom';
import Map from './map';
import GameButtons from './gamebuttons';
import BorderData from './border';
import leafletPip from "@mapbox/leaflet-pip";
import L from 'leaflet';

// main app component
class App extends React.Component {
  
  // contructor
  constructor() {
    super()
    // state for app
    this.state = {
      markerPosition: { lat: 43.99528, lng: -72.69156 },
      gameStarted: false,
      borderLayer: L.geoJSON(BorderData),
    };
    // bind functions
    this.moveMarker = this.moveMarker.bind(this);
    this.clickStart = this.clickStart.bind(this);
    this.startGame = this.startGame.bind(this);
    console.log(this.state.borderLayer);
  }

  // function that moves the current marker to a new position
  moveMarker() {
    // use of object destructuring
    {console.log('moved marker')}
    const { lat, lng } = this.state.markerPosition;
    this.setState({
      markerPosition: {
        lat: lat + 0.0001,
        lng: lng + 0.0001, 
      }
    });
  };

  // fuction handles what happens when the start button is clicked
  clickStart() {
    console.log('clicked start');
    // start the game
    this.startGame();
  }

  // function that picks a random lat and long, centers the map on that spot
  startGame() {

    // find random lat and long
    let randomLatLon = () => {
      // set lat and lon ranges
      let latRange = 45 - 43 + 1;
      let lonRange = -72 - -73 + 1;
      // get random numbers
      const lat = 43 + Math.random() * latRange;
      const lon = -73 + Math.random() * lonRange;
      // set marker position to new randomLatLon
      this.state.markerPosition = { lat: lat, lng: lon };
    }

    // checks if the current position of the marker is inside the border of VT
    let checkInsideBorder = () => {
      // check if lat/lng is inside of border using leafletPip
      const layerLength = leafletPip.pointInLayer(
        [this.state.markerPosition.lng, this.state.markerPosition.lat], this.state.borderLayer
      ).length;
      const result = layerLength ? "yes" : "no";
      return result;
    }
    
    // set result to no by default
    let result = "no";

    // while the marker is not inside the border
    while (result === "no") {
      randomLatLon(); // set marker to a random lat lon
      result = checkInsideBorder();   // check if the lat lon is inside the border
    }
    // set state of game started to true
    this.setState({ gameStarted: true });
  }

  // render function
  render() {
    const markerPosition = this.state.markerPosition;
    const gameStarted = this.state.gameStarted;
    const borderLayer = this.state.borderLayer;
    return (
      <div>
        <Map markerPosition={markerPosition} borderLayer={borderLayer} />
        <div>Current markerPosition: lat: {markerPosition.lat}, lng: {markerPosition.lng}</div>
        <button onClick={this.moveMarker} > Move marker </button>
        <GameButtons gameStarted={gameStarted} clickStart={this.clickStart} />
        
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
