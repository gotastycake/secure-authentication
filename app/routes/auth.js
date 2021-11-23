import path from 'path';

const __dirname = path.resolve(path.dirname(''));

import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;

import { isNotLogged } from '../controllers/middleware.js';
import User from '../models/user.js';

const router = express.Router();

router.get('/login', isNotLogged, (req, res) => {
    res.sendFile(__dirname + '/app/views/login.html', { message: req.flash('error') });
});

router.post('/login', isNotLogged, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
}));

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect email address.' });
        }

        user.validPassword(password, isValid => {
            if (!isValid) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/signup', isNotLogged, (req, res) => {
    res.sendFile(__dirname + '/app/views/signup.html');
});

router.post('/signup', isNotLogged, (req, res) => {
    const funcName = '[Sign up]';
    const { username, password } = req.body;
    if (!username || !password || password.length < 8) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log(`User ${username} is trying to sign up`);
    User.findOne({ username }).then(user => {
        if (user) {
            console.log(`User ${username} already exissts`);
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ username, password });
        const err = user.validateSync();
        if (err) {
            console.log(`User ${username}: unacceptable credentials`);
            return res.status(400).json({ message: 'Unacceptable credentials' });
        }

        user.save().then(savedUser => {
            console.log('Successfully saved', username);
            return req.logIn(savedUser, (err, _) => {
                if (err) {
                    console.error(funcName, 'req.logIn error', err);
                    res.status(500).json({ message: 'Internal server error' });
                }
                res.redirect('/dashboard');
            });
        }).catch(err => {
            console.error(funcName, 'Signup error', err);
        })
    });
});

export default router;