const redis = require("redis").createClient(process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || "localhost");
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const EventEmitter = require('events');
const emitter = new EventEmitter();

// serve resource folder
app.use(express.static('public'));

const sensors = require('./sensors-data');

Object.keys(sensors).forEach((name) => {
  const sensor = sensors[name];
  // clear history (for demo purpose)
  redis.del(name, () => {
    // should be replaced with real-world data collector
    mockDataEmit(name);

    emitter.on(name, (timestamp, value) => {
      // for simplicity use JSON stringify and parse to serialize and deserialize object
      redis.rpush(name, JSON.stringify({ timestamp, value }));
      io.emit(name, { timestamp, value })
    })
  });
});

// used for mock data emitting for a more consecutive result
const lastMockedValues = Object.assign({}, sensors);
Object.keys(lastMockedValues).forEach(name => {
  lastMockedValues[name] = (lastMockedValues[name].max + lastMockedValues[name].min) / 2
});

// mock data emitting using random values
function mockDataEmit(name) {
  const sensor = sensors[name];
  setInterval(() => {
    const timestamp = new Date().valueOf();
    const range = sensor.max - sensor.min;
    let value = lastMockedValues[name] + range * Math.random() / 2 - range / 4;
    if (value < sensor.min) {
      value = sensor.min
    } else if (value > sensor.max) {
      value = sensor.max;
    }
    lastMockedValues[name] = value;
    value = parseFloat(value.toFixed(sensor.digits));
    emitter.emit(name, timestamp, value);
  }, sensor.interval * 1000);
}

// return the list of sensors and their latest value
app.post('/sensors', (req, res) => {
  // perform a query on latest values and attach to the sensors object
  redis.multi(Object.keys(sensors).map((name) => ['lrange', name, -1, -1]))
    .exec((err, data) => {
      data = data.map((entry) => JSON.parse(entry[0] || "{}"));
      const merged = Object.assign({}, sensors);
      Object.keys(sensors).map((name, index) => {
        merged[name] = Object.assign({}, sensors[name], { timestamp: data[index].timestamp, value: data[index].value })
      });
      res.json(merged);
    })
});

// return the history of a sensor within a time range
app.post('/sensors/:sensor', (req, res) => {
  let range = req.query.range || 900;
  if (range < 1) {
    range = 1;
  } else if (range > 3600) {
    range = 3600;
  }
  const limit = Math.ceil(range / (sensors[req.params.sensor].interval));
  redis.lrange(req.params.sensor, -limit, -1, (err, data) => {
    if (data.length > 0) {
      data = data.map(entry => JSON.parse(entry));
      // the first element might be outside the time range; check if need removal
      if (new Date().valueOf() - data[0].timestamp > range * 1000) {
        data.shift();
      }
    }
    res.json(data);
  });
});

// error handlers
redis.on("error", (err) => {
  console.error("Redis Error " + err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal error occurred');
});

server.listen(process.env.PORT || 3000);