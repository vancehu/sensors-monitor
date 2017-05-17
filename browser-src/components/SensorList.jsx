import './SensorList.css';
import React, { PureComponent } from 'react';

// list of sensors
// click on a item will change the active sensor and update the History component
export class SensorList extends PureComponent {
  render() {
    const { sensors, active, changeActive } = this.props;
    return <ul className="SensorList">
      {Object.keys(sensors).map((name) =>
        <li className={`SensorList__item${active === name ? ' active' : ''}`} key={name} onClick={e => changeActive(name)}>
          <div className="SensorList__icon"><img src="./sensor.svg" alt=""/></div>
          <div className="SensorList__text">
            <div className="SensorList__title">{name}</div>
            <div>{isNaN(sensors[name].value) ? 'N/A' : sensors[name].value} <span className="SensorList__time">({new Date(sensors[name].timestamp).toLocaleTimeString().substr(0,8)})</span></div>
          </div>
        </li>)}
    </ul>
  }
}
