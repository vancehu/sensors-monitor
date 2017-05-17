Introduction
-------------------
A basic cloud-based dashboard that monitors different kinds of sensors. Uses Redis to provide historical data, and uses Socket.io to broadcast latest values.


Tech stacks
-------------------
Node.js + Socket.io + Redis + React

Installation
-----------------
Run directly: `npm install` `npm start`

Replace prebuilt js app bundle: `npm run build` (production) or `npm run build:dev` (development, watch mode)

Environment variables:

`PORT`: http server listening port

`REDIS_HOST`: redis server host address

`REDIS_PORT`: redis server port

Project Structure
-------------
```
app.js                                    server script
sensors-data.js                           list of mock sensors (feel free to change)
browser-src/
  index.jsx                               entry point
  App.jsx                                 loads list of sensors and controls other components
  components/
    SensorList.jsx                        list of sensors; click to switch the active sensor
    RangeSelector.jsx                     options to change time range
    History.jsx                           loads the history of the active sensor
    Chart.jsx                             visualization using Highcharts
```
