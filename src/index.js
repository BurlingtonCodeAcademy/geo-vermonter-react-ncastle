// import react & leaflet
import React from 'react';
import ReactDOM from 'react-dom';
import leafletPip from "@mapbox/leaflet-pip";
import L from 'leaflet';
import Modal from 'react-modal';

// import components
import Map from './map';
import GameButtons from './gamebuttons';
import BorderData from './border';
import CountyData from './vtCountyPolygons';
import LocationInfo from './locationinfo';
import CountyList from './countyList';

Modal.setAppElement('#root');

const customStyles = {
  overlay : {
    // covers the entire viewport with slightly transparent color
    backgroundColor       : 'rgba(185, 200, 170, .8)',
    height                : '100vh',
    width                 : '100vw',
    margin                : '0',
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    zIndex                : '3',
    backgroundColor       : "gray",
    border                : "2px solid rgb(120, 235, 140)"
  },
};

const mHeader = {
  marginBottom: "20px",
}


// main app component
class App extends React.Component {
  
  // contructor
  constructor() {
    super()
    // state for app
    this.state = {
      markerPosition: { lat: 43.99528, lng: -72.69156 },
      county: undefined,
      town: undefined,
      gameStarted: false,
      giveUp: false,
      borderLayer: L.geoJSON(BorderData),
      countyLayer: L.geoJSON(CountyData),
      modalOpen: false,
    };
    // bind functions
    this.moveMarker = this.moveMarker.bind(this);
    this.clickStart = this.clickStart.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleGiveup = this.handleGiveup.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleGuess= this.handleGuess.bind(this);
    this.getCounty = this.getCounty.bind(this);
    this.getTown = this.getTown.bind(this);
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

  // function that picks a random lat and long,
  // centers the map on that spot, and zooms in
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
    const county = this.getCounty();
    const town = this.getTown(lat, lon);

    // set marker position to new randomLatLon
    this.setState({
      markerPosition: {
        lat: lat,
        lng: lon
      },
      gameStarted: true,
      giveUp: false,
      county: county,
      town: town
    });
    
    console.log(`${this.state.markerPosition.lng} ${this.state.markerPosition.lat} ${this.state.county} ${this.state.town}`);
  }

  // function that handles when 'I Give Up!' is clicked
  handleGiveup() {

      // set the state which updates components
      this.setState({
        gameStarted: false,
        giveUp: true,
        // county: county,
        // town: town
      })

  }

  /***!! put this into a function that takes a lat and long and returns a count and town !!***/
    // fetch json from nominatim containing the address specified by the lat and lon query params
    // using nominatim reverse geocoding, may be a different / better way to do this
  getTown(lat, lng) {
    return fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=geojson`)
    .then(response => response.json())
    .then(json => {
      console.log({json});
      console.log('town: ' + json.features[0].properties.address.town)
      console.log('city: ' + json.features[0].properties.address.city)
      console.log('village: ' + json.features[0].properties.address.village)
      console.log('hamlet: ' + json.features[0].properties.address.hamlet)
      let address = json.features[0].properties.address;  // get address from json
      let town = address.town || address.city || address.village || address.hamlet; // set town
      console.log({town});
      return town;
    });
  }

  getCounty() {
    let { lat, lng } = this.state.markerPosition;

    // test if inside border
    const layerArray = leafletPip.pointInLayer(
      [lng, lat], this.state.countyLayer
    );
    console.log({layerArray});
    console.log(layerArray[0].feature.properties.CNTYNAME)

    let county = layerArray[0].feature.properties.CNTYNAME;
    return county;
  }

  // modal functions

  // function handles opening modal
  openModal() {
    this.setState({modalOpen: true});
  }

  //function handles what happens after model opens
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }
  
  // function handles closing modal
  closeModal() {
    this.setState({modalOpen: false});
  }

  // function will handle what happens when user makes a guess
  handleGuess(e) {
    e.preventDefault();
    console.log('guess!');

    this.closeModal();
  }

  // render function
  render() {
    const markerPosition = this.state.markerPosition;
    const gameStarted = this.state.gameStarted;
    const borderLayer = this.state.borderLayer;
    const giveUp = this.state.giveUp;
    const county = this.state.county;
    const town = this.state.town;
    console.log(this.state.markerPosition);
    console.log({markerPosition});

    return (
      <div>
        <Map markerPosition={markerPosition} borderLayer={borderLayer} />
        { // if give up clicked, give LocationInfo the markerPosition, county, and town 
          giveUp && 
            <LocationInfo markerPosition={this.state.markerPosition} 
                          county={county} town={town} /> }
        { // if give up button not clicked, LocationInfo gets '??'
          !giveUp && 
            <LocationInfo markerPosition={{lat: '??', lng: '??'}}
                          county={'??'} town={'??'} /> }
        <div>Current markerPosition: lat: {markerPosition.lat}, lng: {markerPosition.lng}</div>
        <button onClick={this.moveMarker} > Move marker </button>
        <GameButtons gameStarted={gameStarted}
                    clickStart={this.clickStart}
                    handleGiveup={this.handleGiveup}
                    openGuessModal={this.openModal} />

        <Modal  id="guessModal"
                isOpen={this.state.modalOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal" >

          <h2 style={mHeader}>Know where you are?</h2>
          
          <form >
            <label>Guess the County: </label>
            <CountyList />
            <button onClick={this.handleGuess}>Guess</button>
            <button onClick={this.closeModal}>Cancel</button>
          </form>

        </Modal>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
