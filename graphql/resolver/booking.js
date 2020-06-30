const Booking = require('../../models/booking');
const Event = require('../../models/event');
// const { dateToString } = require('../../helper/date');
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        }
        catch (err) {
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
            return transformBooking(result);
        }
        catch (err) {
            throw err;
        }
    },
    cancelBooking: async args => {
        try {
            const fetchedBooking = await Booking.findById(args.bookingId).populate('event');
            // const fetchedEvent = singleEvent(fetchedBooking._doc.event);
            await Booking.deleteOne({
                _id: args.bookingId
            });
            // return fetchedEvent;
            // console.log(fetchedBooking._doc);
            return transformEvent(fetchedBooking._doc.event);
        }
        catch (err) {
            throw err;
        }
    }
}
