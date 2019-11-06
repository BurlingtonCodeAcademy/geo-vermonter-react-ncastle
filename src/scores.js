import React from 'react';


export default class Scores extends React.Component {

  // render function
  render() {
    console.log('render scores');
    console.log(`scores array: ${this.props.scoresArray}`)
    return(
      <div>
        <p>THESE ARE THE SCORES</p>
          <ul>
            {this.props.scoresArray.map((score, index) => {
            return(
              
                <li key={index}>
                  <span>{`Game ${index+1}: `}</span> {score}; 
                </li>
            );
        })}
          </ul>
      </div>
    );
  }
}