import React from 'react';



// movementButtons component
class movementButtons extends React.Component {

  render() {

    return(

      <div id="movementButtons">
        <button type='button' onClick={console.log('dosomething')}>NORTH</button>
        <button type='button' onClick={console.log('dosomething')}>EAST</button>
        <button type='button' onClick={console.log('dosomething')}>SOUTH</button>
        <button type='button' onClick={console.log('dosomething')}>WEST</button>
      </div>

    );
  }
}

export default movementButtons;