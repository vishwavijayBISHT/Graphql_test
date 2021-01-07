const authResolver = require("./auth");
const bookingResolver = require("./booking");
const eventsResolver = require("./event");

const rootReolver = {
  ...authResolver,
  ...bookingResolver,
  ...eventsResolver,
};
module.exports = rootReolver;
