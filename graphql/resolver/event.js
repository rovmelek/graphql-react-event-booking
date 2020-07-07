const Event = require('../../models/event');
const User = require('../../models/user');
// const { dateToString } = require('../../helper/date');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event
                .find();
            return events.map(event => {
                return transformEvent(event);
                // mongoose feature event.id = event._doc._id.toString()
                // return {
                //     ...event._doc,
                //     _id: event.id,
                //     date: new Date(event._doc.date).toISOString(),
                //     creator: user.bind(this, event._doc.creator)
                // };
            });
        }
        catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        // const event = {
        //     _id: Math.random().toString(),
        //     title: args.eventInput.title,
        //     description: args.eventInput.description,
        //     price: +args.eventInput.price,
        //     date: args.eventInput.date
        // };
        if (!req.isAuth) {
            throw new Error ('Unauthenticated!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price, // "+" will convert to number (float)
            date: new Date(args.eventInput.date),
            // creator: '5ef945904b207e1c66714ab2'
            creator: req.userId,
        });
        // events.push(event);
        let createdEvent;
        try {
            const existingUser = await User.findById(req.userId);
            // const existingUser = await User.findById('5ef976b7bf0b122862b12203');
            // const existingUser = await User.findById('5ef945904b207e1c66714ab2');
            if (!existingUser) {
                throw new Error('User does not exist.');
            }
            const result = await event.save();
            existingUser.createdEvents.push(event);
            await existingUser.save();
            // createdEvent = {
            //     ...result._doc,
            //     _id: result._doc._id.toString(),
            //     date: new Date(event._doc.date).toISOString(),
            //     creator: user.bind(this, result._doc.creator)
            // };
            // return createdEvent;
            return transformEvent(result);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
};
