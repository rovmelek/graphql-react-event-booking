const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
    }
    catch (err) {
        throw err;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event.creator)
        };
    }
    catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            password: null,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    }
    catch (err) {
        throw err;
    }
}


module.exports = {
    events: async () => {
        try {
            const events = await Event
                .find();
            return events.map(event => {
                // mongoose feature event.id = event._doc._id.toString()
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        }
        catch (err) {
            throw err;
        }
    },
    users: async () => {
        try {
            const users = await User.find();
            return users.map(user => {
                return {
                    ...user._doc,
                    _id: user.id,
                    password: null,
                    createdEvents: events.bind(this, user._doc.createdEvents)
                };
            });
        }
        catch (err) {
            throw err;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            })
        }
        catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        // const event = {
        //     _id: Math.random().toString(),
        //     title: args.eventInput.title,
        //     description: args.eventInput.description,
        //     price: +args.eventInput.price,
        //     date: args.eventInput.date
        // };
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            // creator: '5ef945904b207e1c66714ab2'
            creator: '5ef976b7bf0b122862b12203'
        });
        // events.push(event);
        let createdEvent;
        try {
            const existingUser = await User.findById('5ef976b7bf0b122862b12203');
            // const existingUser = await User.findById('5ef945904b207e1c66714ab2');
            if (!existingUser) {
                throw new Error('User does not exist.');
            }
            const result = await event.save();
            existingUser.createdEvents.push(event);
            await existingUser.save();
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };
            return createdEvent;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    createUser: async args => {
        try {
            const userFindResult = await User.findOne({email: args.userInput.email});
            if (userFindResult) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const userSaveResult = await user.save();
            return {
                ...userSaveResult._doc,
                password: null,
                id: userSaveResult._doc._id.toString()
            };
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findOne({_id: args.eventId});
            const booking = new Booking({
                event: fetchedEvent,
                user: '5ef976b7bf0b122862b12203'
            });
            const result = await booking.save();
            return {
                ...result._doc,
                _id: result.id,
                event: singleEvent.bind(this, result._doc.event),
                user: user.bind(this, result._doc.user),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            };
        }
        catch (err) {
            throw err;
        }
    },
    cancelBooking: async args => {
        try {
            const fetchedBooking = await Booking.findById(args.bookingId);
            const fetchedEvent = singleEvent(fetchedBooking._doc.event);
            await Booking.deleteOne({
                _id: args.bookingId
            });
            return fetchedEvent;
        }
        catch (err) {
            throw err;
        }
    }
}
