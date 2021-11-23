import mongoose from 'mongoose';

const funcName = '[MongoDB]';

mongoose.connect('mongodb+srv://admin:uaZB4ApMnQd8WVh@cluster0.ngfr1.mongodb.net/auth_project?retryWrites=true&w=majority',{
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