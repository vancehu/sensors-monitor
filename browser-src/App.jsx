import './App.css';
import React, { PureComponent } from 'react';
import { socket } from './socket';
import axios from 'axios';
import { History, SensorList, RangeSelector } from './components';

// will fetch the list of sensors using POST /sensors
// then listen to new socket.io messages in real-time to update current values

export class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sensors: {}, // list of sensors and their attributes
      active: null, // the name of the sensor that is actively selected
      range: 900 // time range (in seconds)
    }
    this.addSensorListener = this.addSensorListener.bind(this);
  }

  // listen to socket.io event and update current value of a sensor
  addSensorListener(name) {
    socket.on(name, ({ timestamp, value }) => {
      if (timestamp > this.state.sensors[name].timestamp || isNaN(this.state.sensors[name].timestamp)) {
        const newSensors = Object.assign({}, this.state.sensors);
        newSensors[name] = Object.assign(this.state.sensors[name], { timestamp, value });
        this.setState({ sensors: newSensors });
      }
    })
  };

  componentWillMount() {
    axios.post('/sensors')
      .then((resp) => {
        if (resp.status !== 200) {
          return Promise.reject();
        }
        const sensors = resp.data;
        this.setState({ sensors, active: Object.keys(sensors)[0] });
        Object.keys(sensors).forEach((name) => {
          this.addSensorListener(name);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const { sensors, active, range } = this.state;
    return <div className="App">
      <aside>
        <SensorList sensors={sensors} active={active} changeActive={(active) => this.setState({ active })} />
      </aside>
      <section>
        <RangeSelector range={range} changeRange={(range) => this.setState({ range })} />
        <History range={range} sensor={sensors[active]} range={range} name={active}></History>
      </section>
    </div>
  }
}