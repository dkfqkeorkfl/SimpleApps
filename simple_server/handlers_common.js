require('dotenv').config();
const JWT = require('jsonwebtoken');
const BCRYPT = require('bcrypt');
const { loadDB } = require('./database');
const { AUTH, USER } = require('./traits');
const Joi = require('joi');

function verifyJWT(req, res, next) {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    // Use a regex to extract the token
    const tokenMatch = authHeader?.match(/^Bearer\s+(\S+)$/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (token == null) {
        return res.sendStatus(401); // If there is no token
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // If the token is invalid
        }

        // If the token is valid, add user information to the request object
        req.user = user;
        next(); // Pass control to the next middleware or route handler
    });
};

async function signup(req, res, next) {
    try {
        const schema = Joi.object({
            account: Joi.string().pattern(/^\p{L}/u).required(),
            password: Joi.string().required(),
            is_student: Joi.bool().required(),
            nick: Joi.string().pattern(/^\p{L}/u).required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }

        const { account, password, is_student, nick } = value;
        const hashedPassword = await BCRYPT.hash(password, 10);

        const users = await loadDB(process.env.DB_USER_PATH);
        const exists = users.readAll().find(user => user.account === account);
        if (exists) {
            return res.status(400).send('User already exists.');
        }

        const auth = is_student ? AUTH.STUDENT : AUTH.MANAGER;

        const copied = JSON.parse(JSON.stringify(USER));
        copied.uid = users.readAll().length + 1;
        copied.account = account;
        copied.nick = nick;
        copied.auth = auth;
        copied.password = hashedPassword;
        copied.created = copied.updated = Date.now();

        await users.write(copied).save();
        res.status(201).json({
            code: 0,
            success: 'User created.'
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const schema = Joi.object({
            account: Joi.string().pattern(/^\p{L}/u).required(),
            password: Joi.string().required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }

        const { account, password } = value;
        const users = await loadDB(process.env.DB_USER_PATH);
        const user = users.readAll().find(u => u.account === account);
        if (!user) {
            return res.status(400).send('User not found');
        }

        if (await BCRYPT.compare(password, user.password)) {
            const payload = { uid: Number.parseInt(user.uid), auth: Number.parseInt(user.auth), created: Number.parseInt(user.created), nick: user.nick };
            const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({
                code: 0,
                success: token
            });
        } else {
            res.status(403).send('Password is incorrect');
        }
    } catch (error) {
        next(error);
    }
}

function errorHandler(err, req, res, next) {
    // Log error message in our server's console
    console.error(err.message);

    // If err has no specified error code, set error code to 'Internal Server Error (500)'
    if (!err.statusCode) err.statusCode = 500;

    // Send back error details
    res.status(err.statusCode).send({
        statusCode: err.statusCode,
        message: err.message
    });
}


module.exports = {
    verifyJWT: verifyJWT,
    errorHandler: errorHandler,
    signup: {
        path: '/signup',
        handler: signup
    },
    login: {
        path: '/login',
        handler: login
    }
}