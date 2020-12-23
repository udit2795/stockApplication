const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

const schema = require('../models/schema');


const Strategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (async (username, password, done) => {
    try {
        const result = await schema.USER.findOne({email: username});
        if (!result) {
            return done(null, false);
        }
        const validPassword = await result.isValidPassword(password);
        if (validPassword) {
            return done(null, username);
        } else {
            return done(null, false);
        }
    } catch (error) {
        // return false msg to passport.authenticate
        return done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    done(null, user);
});

module.exports = Strategy;
