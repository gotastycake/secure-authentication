import crypto from 'crypto';
import config from '../config.js';

export const isLogged = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

export const isNotLogged = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
}

const algorithm = "aes-256-cbc";
const securityKey = Buffer.from(config.aesSecretKey);
export const encryptData = (user, ...data) => {
    let { _id } = user;
    const initVector = Buffer.from(_id.toString()).slice(8, 24);

    for (let i = 0; i < data.length; i ++) {
        const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
        data[i] = cipher.update(data[i], "utf-8", "hex");
        data[i] += cipher.final("hex");
    }
    return data;
}

export const decryptData = (user, ...data) => {
    const funcName = "[decryptData]";
    let { _id } = user;

    const initVector = Buffer.from(_id.toString()).slice(8, 24);
    try {
        for (let i = 0; i < data.length; i ++) {
            const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);
            data[i] = decipher.update(data[i], "hex", "utf-8")
            data[i] += decipher.final("utf8");
        }
        return data;
    } catch (err) {
        console.error(funcName, user.username, err);
        return [];
    }
};