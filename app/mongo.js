import mongoose from 'mongoose';
import config from './config.js';

const funcName = '[MongoDB]';

mongoose.connect(config.mongo.url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (err) => {
    console.error(funcName, err.message)
});

db.once('open', () => {
    console.log(funcName, 'Connected!')
});