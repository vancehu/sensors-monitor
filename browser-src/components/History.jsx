import './History.css';
import React, { PureComponent } from 'react';
import { socket } from '../socket';
import axios from 'axios';
import { Chart } from './Chart';

// history of the active sensor
// will fetch the initial history using POST /sensors/:name
// then listen to new socket.io messages in real-time to update history

export class History extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      history: {},
      limit: null
    }
    this.listener = null;
    this.historyListener = this.historyListener.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.setState({ limit: Math.ceil(nextProps.range / nextProps.sensor.interval) });

      if (this.props.name) {
        socket.off(this.props.name, this.historyListener);
      }

      axios.post('/sensors/' + nextProps.name)
        .then((resp) => {
          if (resp.status !== 200) {
            return Promise.reject();
          }
          const history = {};
          resp.data.forEach(entry => history[entry.timestamp] = entry.value);
          this.setState({ history });
          socket.on(nextProps.name, this.historyListener);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  historyListener({ timestamp, value }) {
    const newHistory = Object.assign({}, this.state.history);
    newHistory[timestamp] = value;
    // will remove the outdated data if reaches the limit
    if (Object.keys(newHistory).length > this.state.limit) {
      delete newHistory[Object.keys(newHistory)[0]];
    }
    this.setState({ history: newHistory });
  };

  render() {
    // calculate the average value
    // and pass the history data to Chart component
    const { name, sensor, range } = this.props;
    const { history, limit } = this.state;
    const timestamps = Object.keys(history);
    if (name) {
      const len = Object.keys(history).length;
      const average = len > 0 ?
        (timestamps.reduce((sum, timestamp) => sum + history[timestamp], 0) / Math.min(len,limit)).toFixed(2):
        'N/A';
      return <div className="History">
        <Chart history={history} end={parseInt(timestamps[timestamps.length - 1])} range={range} max={sensor.max} min={sensor.min} name={name} />
        <div className="History__stats">Average value of the past {range} second{range && 's'}: {average}</div>
      </div>
    } else {
      return <div className="History__fetching"></div>
    }
  }
}