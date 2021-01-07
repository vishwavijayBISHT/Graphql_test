const { dateToString } = require("../../helpers/date");
const Event = require("../../models/event");
const User = require("../../models/user");
const { tranformEvent } = require("./merge");

module.exports = {
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map((event) => {
          return tranformEvent(event);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  createEvent: (args, req) => {
    if (!req.isAuth) {
      throw new Error("un auyhenticated");
    }

    let createdevent;

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    return event
      .save()
      .then((result) => {
        createdevent = tranformEvent(result);
        return User.findById("5fead57a4f576f6a908f57fe");
      })
      .then((user) => {
        user.createdEvents.push(event);
        return user.save();
      })
      .then((result) => {
        return createdevent;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
};
