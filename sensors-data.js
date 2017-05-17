// simulate a list of sensors
// you can always add extra sensors by modify this
module.exports = {
  electricity1: { interval: 1, min: 0, max: 1, digits: 2 },
  temperature1: { interval: 10, min: -50, max: 150, digits: 1 }, // negative value example
  motion1: { interval: 2, min: 0, max: 1, digits: 0 }, // binary example
  smoke1: { interval: 60, min: 0, max: 65535, digits: 0 }
};