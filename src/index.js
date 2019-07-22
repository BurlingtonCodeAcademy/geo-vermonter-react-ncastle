import React from 'react';
import ReactDOM from 'react-dom';
import Map from './map';
import GameButtons from './gamebuttons';

// main app component
class App extends React.Component {
  
  // contructor
  constructor() {
    super()
    // state for app
    this.state = {
      markerPosition: { lat: 43.99528, lng: -72.69156 },
      gameStarted: false,
    };
    // bind functions
    this.moveMarker = this.moveMarker.bind(this);
    this.clickStart = this.clickStart.bind(this);
  }

  // function that moves the current marker to a new position
  moveMarker() {
    // use of object destructuring
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
    this.setState({gameStarted: true});
  }

  // render function
  render() {
    const markerPosition = this.state.markerPosition;
    const gameStarted = this.state.gameStarted;
    return (
      <div>
        <Map markerPosition={markerPosition} />
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
