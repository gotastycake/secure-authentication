import dotenv from 'dotenv';

const ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development';

dotenv.config({ path: `${ENV}.env` });

export default {
    env: ENV,
    mongo: {
        url: process.env.MONGO_URL,
    },
    aesSecretKey: process.env.AES_SECRET_KEY,
    signupStatuses: {
        success: 'success',
        alreadyExists: 'already exists',
    },
};