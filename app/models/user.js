import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import bcrypt from 'bcrypt';
const { Schema } = mongoose;


const User = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        minlength: 3,
        maxlength: 64,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    }
});

User.plugin(passportLocalMongoose);

User.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, function (err, salt) {
        if (err) { console.error(err); return next(err); }
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) { console.error(err); return next(err); }

            user.password = hash;
            next();
        });
    });
});

User.methods.validPassword = function (password, cb) {
    let funcName = '[UserModel:validPassword]';
    bcrypt.compare(password, this.password, function (err, passwordIsValid) {
        if (err) {
            console.error(funcName, err.message);
        }
        if (err || !passwordIsValid) {
            return cb(false);
        }
        cb(true);
    });
};

export default mongoose.model('User', User);