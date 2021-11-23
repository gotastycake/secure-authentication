import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoDBSession from 'connect-mongodb-session';

const MongoDBStore = mongoDBSession(session);
import passport from 'passport';
import flash from 'connect-flash';
import morganBody from 'morgan-body';

import authRouter from './routes/auth.js';
import indexRouter from './routes/index.js';

import './mongo.js';

const app = express();

morganBody(app, {
    timezone: 'America/Chicago',
    logResponseBody: false,
    skip: (req, res) => {
        if (req.originalUrl.indexOf('.css') !== -1 || req.originalUrl.indexOf('.js') !== -1) {
            return true;
        }
        return false;
    }
});

const store = new MongoDBStore({
    uri: 'mongodb+srv://admin:uaZB4ApMnQd8WVh@cluster0.ngfr1.mongodb.net/auth_project?retryWrites=true&w=majority',
    collection: 'webSessions'
});

app.use(flash());

app.use(session({
    secret: 'secret password',
    store,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRouter);
app.use('/', indexRouter);

// assign port
const port = 3000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));