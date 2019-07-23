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
    const { borderLayer } = this.state;
    console.log(borderLayer);
    // there might be a better way to do this
    const vtBounds = borderLayer.getBounds();
    const xMax = vtBounds.getEast();
    const xMin = vtBounds.getWest();
    const yMax = vtBounds.getSouth();
    const yMin = vtBounds.getNorth();

    // find random lat and long 
    // -> pull this out and generalize to find 
    // random points in a given polygon/border?
    let randomLatLon = () => {
      // get random numbers
      const lat = yMin + (Math.random() * (yMax - yMin));
      const lon = xMin + (Math.random() * (xMax - xMin));
      console.log(`${lat} ${lon}`);
      // test if inside border
      const layerLength = leafletPip.pointInLayer(
                            [lon, lat], borderLayer, true
                          ).length;
      console.log({layerLength});
      const result = layerLength ? "yes" : "no";
      console.log({result});
      
      // if inside border, return the lat and lon as an object
      if (result === "yes") {
        return {lat:lat, lon: lon};
      //else return randomLatLon()
      } else {
        return randomLatLon();
      }
      
    }
    //console.log(` random: ${JSON.stringify(randomLatLon())}`);
    const { lat, lon } = randomLatLon();

    // set marker position to new randomLatLon
    this.setState({
      markerPosition: {
        lat: lat,
        lng: lon
      }
    });
    
    console.log(`${this.state.markerPosition.lng} ${this.state.markerPosition.lat}`);
  }

  // render function
  render() {
    const markerPosition = this.state.markerPosition;
    const gameStarted = this.state.gameStarted;
    const borderLayer = this.state.borderLayer;
    console.log(this.state.markerPosition);
    console.log({markerPosition});
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
