import React from 'react';


// game button component
class GameButtons extends React.Component {

  // required render function returns JSX for the buttons
  render() {

    if(!this.props.gameStarted) {
      return (
        <div id="game-buttons">
          <button onClick={this.props.clickStart}>Start</button>
          <button disabled="disabled">Guess</button>
          <button disabled="disabled">Quit</button>
        </div>
      );
    } else {
      return(
        <div id="game-buttons">
          <button disabled="disabled" onClick={this.props.clickStart}>Start</button>
          <button>Guess</button>
          <button>Quit</button>
        </div>
      );
    }
  }

}

// export the component
export default GameButtons;