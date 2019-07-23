import React from 'react';

// component that has information on the latitude, longitude, county, and town
class LocationInfo extends React.Component {

  // called when the component is mounted to the DOM
  componentDidMount() {

  }

  // required render function called every time state or props change
  render() {
    let lat = '??';
    let long = '??';
    let county = '??';
    let town = '??';

    return(
      <div id="location">
        {`| Lat: ${lat} | Long: ${long} | County: ${county} | Town: ${town} |`}
      </div>
    );
  }

}

// export the component
export default LocationInfo;