import './Chart.css';
import React, { PureComponent } from 'react';
import * as Highcharts from 'highcharts';

Highcharts.setOptions({ global: { useUTC: false } }); // use local timezone

// use Highcharts for chart plotting
export class Chart extends PureComponent {
  constructor(props) {
    super(props);
    this.chart = null;
  }
  componentDidMount() {
    this.chart = Highcharts.chart(this.refs.chart, {
      chart: {    animation: false},
      plotOptions: { series: { animation: false } },
      yAxis: { title: { text: 'Value' } },
      xAxis: { title: { text: 'Time' }, type: 'datetime' },
      legend: { enabled: false },
      series: [{ name: "Value", data: [] }]
    });
  }


  render() {
    const { end, range, max, min, history, name } = this.props;
    const start = end - range * 1000;
    if (this.chart) {
      this.chart.update({
        title: { text: name },
        xAxis: { min: start, max: end },
        yAxis: { min, max },
        series: [{ data: Object.keys(history).map(timestamp => [parseInt(timestamp), history[timestamp]]) }]
      })

    }
    return <div ref="chart"></div>
  }
}