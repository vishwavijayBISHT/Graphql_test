const User = require("../../models/user");
const Event = require("../../models/event");
const events = (eventids) => {
  return Event.findById({ _id: { $in: eventids } })
    .then((events) => {
      return events.map((event) => {
        return tranformEvent(event);
      });
    })
    .catch((err) => {
      throw err;
    });
};
const singleEvent = async (id) => {
  try {
    const event = await Event.findById(id);
    return tranformEvent(event);
  } catch (err) {
    throw err;
  }
};
const user = (userid) => {
  return User.findById(userid)
    .then((user) => {
      return {
        ...user._doc,
        _id: user.id,

        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((err) => {
      throw err;
    });
};

const tranformEvent = (event) => {
  return {
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event._doc.creator),
    date: new Date(event._doc.date).toISOString(),
  };
};

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
exports.tranformEvent = tranformEvent;
