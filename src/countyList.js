import React from 'react';


/** CountyList Component **/

class CountyList extends React.Component {

  render() {
    return(
      <select name="counties" value={this.props.guess} onChange={this.props.handleChange}>
        <option value="Addison">Addison</option>
        <option value="Bennington">Bennington</option>
        <option value="Caledonia">Caledonia</option>
        <option value="Chittenden">Chittenden</option>
        <option value="Essex">Essex</option>
        <option value="Franklin">Franklin</option>
        <option value="Grand">Grand Isle</option>
        <option value="Lamoille">Lamoille</option>
        <option value="Orange">Orange</option>
        <option value="Orleans">Orleans</option>
        <option value="Rutland">Rutland</option>
        <option value="Washington">Washington</option>
        <option value="Windham">Windham</option>
        <option value="Windsor">Windsor</option>
     </select>
    );
  }
}

export default CountyList;