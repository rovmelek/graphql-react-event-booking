const DataLoader = require('dataloader');

const Booking = require('../../models/booking');
const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helper/date');

const eventLoader = new DataLoader((eventIds) => {
    console.log(eventIds);
    return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
    console.log(userIds);
    return User.find({_id: {$in: userIds}});
});

const transformEvent = event => {
    // console.log(event);
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator),
        // creator: userLoader.load.bind(this, event.creator),
    };
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        // user: userLoader.load.bind(this, booking._doc.user),
        // event: eventLoader.load(booking._doc.event),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
};

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.sort((a, b) => {
            return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString());
        });
        return events.map(event => {
            return transformEvent(event);
            // return {
            //     ...event._doc,
            //     _id: event.id,
            //     date: new Date(event._doc.date).toISOString(),
            //     creator: user.bind(this, event.creator)
            // };
        });
    }
    catch (err) {
        throw err;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
        // return transformEvent(event);
        // return {
        //     ...event._doc,
        //     _id: event.id,
        //     date: new Date(event._doc.date).toISOString(),
        //     creator: user.bind(this, event.creator)
        // };
    }
    catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        // const user = await User.findById(userId);
        // using userId.toString() is because each userId is a MongoDB object. In JavaScript, objects are not equal even they are holding the same value
        const user = await userLoader.load(userId.toString());
        return {
            ...user._doc,
            _id: user.id,
            password: null,
            // createdEvents: events.bind(this, user._doc.createdEvents)
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
        };
    }
    catch (err) {
        throw err;
    }
}

exports.events = events;
// exports.singleEvent = singleEvent;
// exports.user = user;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;