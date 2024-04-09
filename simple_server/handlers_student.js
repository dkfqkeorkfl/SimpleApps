require('dotenv').config();
const { loadDB } = require('./database');
const { AUTH, SUBSCRIBE } = require('./traits');
const Joi = require('joi');

async function unsubscribe(req, res, next) {
    try {
        const schema = Joi.object({
            school: Joi.number().required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }

        const { uid, auth } = req.user;
        if (auth !== AUTH.STUDENT) {
            return res.status(403).send('You do not have permission.');
        }

        const { school } = value;
        const subscribes = await loadDB(process.env.DB_SUBSCRIBE_PATH);
        const subscribe = subscribes.readAll().find(item => item.school === school && item.uid === uid);
        if (subscribe == null) {
            return res.status(404).send('No data matching your criteria could be found.');
        }

        subscribe.disable = true;
        subscribe.updated = Date.now();
        await subscribes.save();
        res.json({
            code: 0,
            success: 'unsubscribed'
        });
    }
    catch (e) {
        next(e)
    }
}

async function subscribe(req, res, next) {
    try {
        const schema = Joi.object({
            school: Joi.number().required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }

        const { uid, auth } = req.user;
        if (auth !== AUTH.STUDENT) {
            return res.status(403).send('You do not have permission.');
        }

        const { school } = value;
        const schools = await loadDB(process.env.DB_SCHOOL_PATH);
        const exists = schools.readAll().find(item => item.id === school);
        if (exists == null) {
            return res.status(404).send('No data matching your criteria could be found.');
        }

        const subscribes = await loadDB(process.env.DB_SUBSCRIBE_PATH);
        const subscribe = subscribes.readAll().find(item => item.school === school && item.uid === uid);
        if (subscribe != null) {
            subscribe.disable = false;
            subscribe.updated = Date.now();
            await subscribes.save();
        }
        else {
            let copied = JSON.parse(JSON.stringify(SUBSCRIBE));
            copied.id = subscribes.readAll().length + 1;
            copied.uid = uid;
            copied.school = school;
            copied.updated = copied.created = Date.now();
            await subscribes.write(copied).save();
        }

        res.json({
            code: 0,
            success: 'subscribe created.'
        });
    }
    catch (e) {
        next(e)
    }
}

async function getSubscribes(req, res, next) {
    try {
        const { uid, auth } = req.user;
        if (auth !== AUTH.STUDENT) {
            return res.status(403).send('You do not have permission.');
        }

        const subscribes = await loadDB(process.env.DB_SUBSCRIBE_PATH);
        const subscribe = subscribes.readAll().filter(item => item.disable === false && item.uid === uid);
        if (subscribe.length === 0) {
            res.json({
                code: 0,
                success: []
            });
            return;
        }

        const schools = await loadDB(process.env.DB_SCHOOL_PATH);
        const school = schools.readAll().filter(item => {
            const finded = subscribe.find(s => s.school === item.id);
            return finded != null;
        });
        res.json({
            code: 0,
            success: school
        });
    }
    catch (e) {
        next(e)
    }
}

async function getPosts(req, res, next) {
    try {
        const schema = Joi.object({
            school: Joi.number().required(),
        });

        const { error, value } = schema.validate(req.query);
        if (error) {
            throw new Error(error.message);
        }

        const { uid, auth } = req.user;
        if (auth !== AUTH.STUDENT) {
            return res.status(403).send('You do not have permission.');
        }

        const { school } = value;
        const subscribes = await loadDB(process.env.DB_SUBSCRIBE_PATH);
        const subscribe = subscribes.readAll().find(item => item.disable === false && item.uid === uid && item.school === school);
        if (subscribe == null) {
            return res.status(404).send('No data matching your criteria could be found.');
        }

        
        const posts = await loadDB(process.env.DB_POST_PATH);
        res.json({
            code: 0,
            success: posts.readAll().filter(item => item.disable === false && item.school === school && item.created > subscribe.updated)
        });
    }
    catch (e) {
        next(e)
    }
}

module.exports = {
    unsubscribe: {
        path: '/student/unsubscribe',
        handler: unsubscribe
    },
    subscribe: {
        path: '/student/subscribe',
        handler: subscribe
    },
    getSubscribes: {
        path: '/student/subscribe',
        handler: getSubscribes
    },
    getPosts: {
        path: '/student/post',
        handler: getPosts
    },
}
