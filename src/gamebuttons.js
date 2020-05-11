import React from 'react';


/** Game Button Component **/

class GameButtons extends React.Component {

  // required render function returns JSX for the buttons
  render() {
    if(!this.props.gameStarted) {
      return (
        <div id="game-buttons">
          <button onClick={this.props.clickStart}>Start a Game</button>
          <button disabled="disabled">Guess the Spot</button>
          <button disabled="disabled">I Give Up!</button>
        </div>
      );
    } else {
      return(
        <div id="game-buttons">
          <button disabled="disabled" onClick={this.props.clickStart}>Start a Game</button>
          <button onClick={this.props.openGuessModal}>Guess the Spot</button>
          <button onClick={this.props.handleGiveup}>I Give Up!</button>
        </div>
      );
    }
  }
}

// export the component
export default GameButtons;