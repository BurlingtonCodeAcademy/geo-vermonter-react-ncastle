import React from 'react';


/** movementButtons Component **/

class movementButtons extends React.Component {

  render() {
    return(
      <div id="movementButtons">
        <button onClick={this.props.moveNorth}>NORTH</button>
        <button onClick={this.props.moveEast}>EAST</button>
        <button onClick={this.props.moveSouth}>SOUTH</button>
        <button onClick={this.props.moveWest}>WEST</button>
      </div>
    );
  }
}

export default movementButtons;