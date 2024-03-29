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
import MovementButtons from './movementButtons';
import Scores from './scores';

Modal.setAppElement('#root');


/** Styles for Modal **/

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

const mSubtitle = {
  color: 'green',
  paddingBottom: '8%',
  textAlign: 'center'
}



// create storage for local storage
let myStorage = window.localStorage;
console.log({myStorage});

const highscore_div = document.getElementById('nav');


/** Main App Component **/

class App extends React.Component {
  // contructor
  constructor() {
    super();
    // default state for app
    this.state = {
      markerPosition  : { lat: 43.99528, lng: -72.69156 },
      startPosition   : { lat: undefined, lng: undefined },
      county          : undefined,
      town            : undefined,
      gameStarted     : false,
      giveUp          : false,
      borderLayer     : L.geoJSON(BorderData),
      countyLayer     : L.geoJSON(CountyData),
      modalOpen       : false,
      countyGuess     : 'Addison',
      correctGuess    : false,
      score           : 100,
      showing         : 'game',
      scoresArray     : [],
    };
    // bind functions
    this.clickStart =       this.clickStart.bind(this);
    this.startGame =        this.startGame.bind(this);
    this.handleGiveup =     this.handleGiveup.bind(this);
    this.openModal =        this.openModal.bind(this);
    this.afterOpenModal =   this.afterOpenModal.bind(this);
    this.closeModal =       this.closeModal.bind(this);
    this.handleGuess =      this.handleGuess.bind(this);
    this.getTownCounty =    this.getTownCounty.bind(this);
    this.handleChange =     this.handleChange.bind(this);
    this.handleGuess =      this.handleGuess.bind(this);
    this.moveNorth =        this.moveNorth.bind(this);
    this.moveEast =         this.moveEast.bind(this);
    this.moveSouth =        this.moveSouth.bind(this);
    this.moveWest =         this.moveWest.bind(this);
    this.returnToStart =    this.returnToStart.bind(this);
    this.sendScore =        this.sendScore.bind(this);
    this.saveScoreLocally = this.saveScoreLocally.bind(this);
    this.toggleScreen =     this.toggleScreen.bind(this);
    this.setScoresArray =   this.setScoresArray.bind(this);

    // target high score div for toggling high score state
    highscore_div.addEventListener('click', this.toggleScreen);

  }
  
  componentDidMount() {
    this.setScoresArray();
  }

  toggleScreen() {
    if (this.state.showing === 'game') {
      highscore_div.innerText = 'Click for Game';
      this.setState({showing: 'scores'});
    } else {
      highscore_div.innerText = 'Click for High Scores';
      this.setState({showing: 'game'});
    }
  }


  // fuction handles what happens when the start button is clicked
  clickStart() {
    console.log('clicked start');
    // start the game
    this.startGame();
  }


  // function that picks a random lat and long,
  // centers the map on that spot, and zooms in
  async startGame() {
    const { borderLayer } = this.state; // obj destructure
    console.log(borderLayer);
    // get bounds, mins, and maxs
    // there might be a better way to do this ?
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
    // get random lat and lon to start marker at
    const { lat, lon } = randomLatLon();
    // get the town and county the marker is in
    const {town, county } = await this.getTownCounty(lat, lon);
    console.log(`${town} ${county}`);

    // update/reset the state
    this.setState({
      // this is a random lat/lon
      markerPosition  : { lat: lat, lng: lon },
      startPosition   : { lat: lat, lng: lon },
      gameStarted     : true,
      // set to default values to start or reset game
      giveUp          : false,
      correctGuess    : false,
      countyGuess     : 'Addison',
      county          : county,
      town            : town,
      moves           : [[lat, lon]],
      score           : 100,
    });

    console.log(`moves: ${this.state.moves}`);
    
    console.log(`${this.state.markerPosition.lng} ${this.state.markerPosition.lat} ${this.state.county} ${this.state.town}`);
  }


  // function that handles when 'I Give Up!' is clicked
  handleGiveup() {
      // set the state which updates components
      this.setState({
        gameStarted: false,
        giveUp: true,
      })
  }

  async sendScore() {
    console.log('sending score!');
    // do some stuff, send score to server
    await fetch('/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: "tanto", value: "999", date:"2019-11-04T18:10:50"})
    })
    .then(response => response.json())
    .then(json => console.log('send score response json ' + json));
  }

  saveScoreLocally() {
    console.log('saving score locally');
    // do some stuff, save score locally
    myStorage.setItem(`game ${myStorage.length+1}`, `${this.state.score}`)
    console.log(myStorage);

    this.setScoresArray();
    
  }

  // pushes all items in local storage to an array and is set in state
  setScoresArray() {
    console.log('setting score array')
    let scoresArray = [];

    // set state of scores as array
    for (let i = 1; i <= myStorage.length; i++) {
      console.log(myStorage.getItem(`game ${i}`));
      scoresArray.push(myStorage.getItem(`game ${i}`));
    }
    this.setState({scoresArray: scoresArray});
  }


  // fetch json from nominatim containing the address specified by the lat and lon query params
  // using nominatim reverse geocoding, may be a different / better way to do this
  async getTownCounty(lat, lng) {
    // fetch town and county from notimatim
    let {town, county} = 
        await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=geojson`)
              .then(response => response.json())
              .then(json => {
                // get address and town from json
                let address = json.features[0].properties.address;
                let town = address.town || address.city || address.village || address.hamlet;
                return {town: JSON.stringify(town), county: address.county.split(" ")[0] };
              });
    return {town: town.split('"')[1], county: county };  // this removes the quotation marks from string
  }


  // function will handle what happens when user makes a guess
  handleGuess(evt) {
    evt.preventDefault();
    console.log('guess!');
    console.log(`county guess: ${this.state.countyGuess}`);
    console.log(`county: ${this.state.county}`)

    // if the county guess is the same as the county
    if (this.state.county.includes(this.state.countyGuess)) {
      // display correct message in modal
      this.subtitle.textContent = 'Correct!';
      this.setState({correctGuess: true, gameStarted: false}, this.saveScoreLocally)
      this.sendScore();
      this.closeModal(evt);  // close modal
    } else {
      // otherwise display wrong in modal
      this.subtitle.textContent = 'WRONG! TRY AGAIN';
      // subtract from score
      this.setState({score: this.state.score - 10});
    }


    // this.closeModal(evt);  // close the modal
  }

  handleChange(e) {
    console.log(`handle change: ${e.target.value}`);
    this.setState({countyGuess: e.target.value});
  }


  /* functions for movement buttons, when one is clicked
     score decreases by 1 point */
  moveNorth() {
    const { lat, lng } = this.state.markerPosition;
    const score = this.state.score;
    const moves = this.state.moves.concat([[lat + 0.001, lng]]);
    this.setState({
      markerPosition: {
        lat: lat + 0.001,
        lng: lng
      },
      score: score - 1,
      moves: moves
    });
    console.log(`movesN: ${this.state.moves}`);
  }

  moveSouth() {
    const { lat, lng } = this.state.markerPosition;
    const score = this.state.score;
    const moves = this.state.moves.concat([[lat - 0.001, lng]]);
    this.setState({
      markerPosition: {
        lat: lat - 0.001,
        lng: lng
      },
      score: score - 1,
      moves: moves
    });
    console.log(`movesS: ${this.state.moves}`);
  }

  moveEast() {
    const { lat, lng } = this.state.markerPosition;
    const score = this.state.score;
    const moves = this.state.moves.concat([[lat, lng + 0.001]]);
    this.setState({
      markerPosition: {
        lat: lat,
        lng: lng + 0.001
      },
      score: score - 1,
      moves: moves
    });
    console.log(`movesE: ${this.state.moves}`);
  }

  moveWest() {
    const { lat, lng } = this.state.markerPosition;
    const score = this.state.score;
    const moves = this.state.moves.concat([[lat, lng - 0.001]]);
    this.setState({
      markerPosition: {
        lat: lat,
        lng: lng - 0.001
      },
      score: score - 1,
      moves: moves
    });
    console.log(`movesW: ${this.state.moves}`);
  }

  returnToStart() {
    const { lat, lng } = this.state.startPosition;
    const moves = this.state.moves.concat([[lat, lng]]);
    this.setState({
      markerPosition: {
        lat: lat,
        lng: lng
      },
      moves: moves
    });
  }

  
  /** Modal Functions **/

  // function handles opening modal
  openModal() {
    this.setState({modalOpen: true});
  }

  //function handles what happens after model opens
  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#ad8';
    this.subtitle.style.paddingBottom = '8%';
    this.subtitle.style.textAlign = 'center';

    this.form.style.padding = '50px';
  }
  
  // function handles closing modal
  closeModal(e) {
    e.preventDefault();
    this.setState({modalOpen: false});
  }

  
  // render function
  render() {
    const markerPosition =  this.state.markerPosition;
    const gameStarted =     this.state.gameStarted;
    const borderLayer =     this.state.borderLayer;
    const giveUp =          this.state.giveUp;
    const county =          this.state.county;
    const town =            this.state.town;
    const correctGuess =    this.state.correctGuess;
    const score =           this.state.score;
    const moves =           this.state.moves;
    const scoresArray =     this.state.scoresArray;
    let polyline;

    console.log({moves});
    if (moves) {
       polyline = L.polyline( moves,
                            { color: 'white',
                              dashArray: "5 15",
                              dashOffset: "10px" } );
    }
    if (this.state.showing === 'game') {
      return (
        
        <div>
          <Map  markerPosition={markerPosition} borderLayer={borderLayer}
                polyline={polyline}/>
          { // if give up clicked or user guessed correctly, give LocationInfo the markerPosition, county, and town 
            (giveUp || correctGuess) && 
              <LocationInfo markerPosition={this.state.markerPosition} 
                            county={county} town={town} /> }
          { // if give up button not clicked and user did not guess correctly, LocationInfo gets '??'
            (!giveUp && !correctGuess) && 
              <LocationInfo markerPosition={{lat: '??', lng: '??'}}
                            county={'??'} town={'??'} /> }
  
          <div>Current score: {score}</div>
  
          <GameButtons  gameStarted     ={gameStarted}
                        clickStart      ={this.clickStart}
                        handleGiveup    ={this.handleGiveup}
                        openGuessModal  ={this.openModal} />
          
          <MovementButtons  moveNorth   ={this.moveNorth}
                            moveEast    ={this.moveEast}
                            moveSouth   ={this.moveSouth}
                            moveWest    ={this.moveWest}
                          returnToStart ={this.returnToStart} />
  
          <Modal  id              = "guessModal"
                  closeTimeoutMS  = {1500}
                  isOpen          = {this.state.modalOpen}
                  onAfterOpen     = {this.afterOpenModal}
                  onRequestClose  = {this.closeModal}
                  style           = {customStyles}
                  contentLabel    = "Example Modal" >
  
            <h2 ref={subtitle => this.subtitle = subtitle}>Know which county?</h2>
            
            <form method="post" onSubmit = {this.handleGuess}
                  ref={form => this.form = form} >
              <label id='formLabel' >Guess the County: </label>
              <CountyList handleChange = {this.handleChange} />
              <input type="submit" value="Guess"/>
              <button onClick={this.closeModal}>Cancel</button>
            </form>
  
          </Modal>
        </div>
      );  // end return
    } else if (this.state.showing === 'scores') {
      return (
        <Scores scoresArray = {scoresArray}/>
      );
    }
  } // end render
} // end App

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
