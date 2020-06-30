const bcrypt = require('bcryptjs');
const User = require('../../models/user');
// const { dateToString } = require('../../helper/date');
const { events } = require('./merge');

module.exports = {
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
    }
}

