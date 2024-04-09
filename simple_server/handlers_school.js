require('dotenv').config();
const { loadDB } = require('./database');
const { AUTH, SCHOOL, POST } = require('./traits');
const Joi = require('joi');

async function listSchools(req, res, next) {
    try {
        const table = await loadDB(process.env.DB_SCHOOL_PATH);
        res.json({
            code: 0,
            success: table.readAll()
        });
    }
    catch (e) {
        next(e);
    }
}

async function createOwnSchool(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().pattern(/^\p{L}/u).required(),
            local: Joi.string().pattern(/^\p{L}/u).required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }

        const { uid, auth } = req.user;
        if (auth !== AUTH.MANAGER) {
            return res.status(403).send('You do not have permission.');
        }
        const { name, local } = value;
        const table = await loadDB(process.env.DB_SCHOOL_PATH);
        let exists = table.readAll().find(item => item.name === name && item.local === local);
        if (exists) {
            return res.status(400).send('School already exists.');
        }

        let copied = JSON.parse(JSON.stringify(SCHOOL));
        copied.id = table.readAll().length + 1;
        copied.name = name;
        copied.local = local;
        copied.owner = uid;
        copied.updated = copied.created = Date.now();

        await table.write(copied).save();
        res.json({
            code: 0,
            success: 'school created.'
        });
    }
    catch (e) {
        next(e);
    }
}

async function updateOwnSchool(req, res, next) {
    try {
        const schema = Joi.object({
            school: Joi.string().pattern(/^\p{L}/u).required(),
            disable: Joi.bool().default(false),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }

        const { uid, auth } = req.user;
        if (auth !== AUTH.MANAGER) {
            return res.status(403).send('You do not have permission.');
        }

        const { school } = value;
        const table = await loadDB(process.env.DB_SCHOOL_PATH);
        const finded = table.readAll().find(item => item.owner === uid && item.id === school);
        if (finded == null) {
            throw new Error(`cannot find the school(${school})`);
        }

        finded.disable = disable;
        await table.save();
        res.json({
            code: 0,
            success: own
        });
    }
    catch (e) {
        next(e);
    }
}

async function getOwnSchools(req, res, next) {
    try {
        const { uid, auth } = req.user;
        if (auth !== AUTH.MANAGER) {
            return res.status(403).send('You do not have permission.');
        }

        const table = await loadDB(process.env.DB_SCHOOL_PATH);
        const own = table.readAll().filter(item => item.owner === uid);
        res.json({
            code: 0,
            success: own
        });
    }
    catch (e) {
        next(e);
    }

}

async function createOwnPost(req, res, next) {
    try {
        const schema = Joi.object({
            school: Joi.number().required(),
            title: Joi.string().pattern(/^\p{L}/u).required(),
            contents: Joi.string().pattern(/^\p{L}/u).required(),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }

        const { uid, auth } = req.user;
        if (auth !== AUTH.MANAGER) {
            return res.status(403).send('You do not have permission.');
        }

        const { school, title, contents } = value;
        const schools = await loadDB(process.env.DB_SCHOOL_PATH);
        const onwer = schools.readAll().find(item => item.id == school && item.owner == uid);
        if (onwer == null) {
            return res.status(404).send('No data matching your criteria could be found.');
        }

        const posts = await loadDB(process.env.DB_POST_PATH);
        let copied = JSON.parse(JSON.stringify(POST));
        copied.id = posts.readAll().length + 1;
        copied.school = school;
        copied.owner = uid;
        copied.title = title;
        copied.contents = contents
        copied.uid = uid;
        copied.updated = copied.created = Date.now();

        await posts.write(copied).save();
        res.json({
            code: 0,
            success: 'post created.'
        });
    }
    catch (e) {
        next(e)
    }
}

async function getOwnPosts(req, res, next) {
    try {
        const { uid, auth } = req.user;
        if (auth !== AUTH.MANAGER) {
            return res.status(403).send('You do not have permission.');
        }

        const posts = await loadDB(process.env.DB_POST_PATH);
        const finded = posts.readAll().filter(item => item.disable === false && item.owner == uid);
        res.json({
            code: 0,
            success: finded
        });
    }
    catch (e) {
        next(e)
    }
}

async function updateOwnPost(req, res, next) {
    try {
        const schema = Joi.object({
            post: Joi.number().required(),
            title: Joi.string().pattern(/^\p{L}/u),
            contents: Joi.string().pattern(/^\p{L}/u),
            disable: Joi.bool().default(false),
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new Error(error.message);
        }

        const { uid, auth } = req.user;
        if (auth !== AUTH.MANAGER) {
            return res.status(403).send('You do not have permission.');
        }

        const { post, title, contents, disable } = value;
        const posts = await loadDB(process.env.DB_POST_PATH);
        const finded = posts.readAll().find(item => item.disable === false && item.id == post && item.owner == uid);
        if (post == null) {
            return res.status(404).send('No data matching your criteria could be found.');
        }

        finded.disable = disable;
        finded.updated = Date.now();
        if (title != null)
            finded.title = title;
        if (contents != null)
            finded.contents = contents;
        await posts.save();
        res.json({
            code: 0,
            success: 'post updated.'
        });
    }
    catch (e) {
        next(e)
    }
}

module.exports = {
    listSchool: {
        path: '/school',
        handler: listSchools
    },
    createOwnSchool: {
        path: '/school/own',
        handler: createOwnSchool
    },
    updateOwnSchool: {
        path: '/school/own',
        handler: updateOwnSchool
    },
    getOwnSchools: {
        path: '/school/own',
        handler: getOwnSchools
    },

    createOwnPost: {
        path: '/school/own/post',
        handler: createOwnPost
    },
    getOwnPosts: {
        path: '/school/own/post',
        handler: getOwnPosts
    },
    updateOwnPost: {
        path: '/school/own/post',
        handler: updateOwnPost
    },
}