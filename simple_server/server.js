require('dotenv').config();
const EXPRESS = require('express');
const { AUTH, } = require('./traits');
const { loadDB } = require('./database');
const HANDLERS_COMMON = require('./handlers_common');
const HANDLERS_SCHOOL = require('./handlers_school');
const HANDLERS_STUDENT = require('./handlers_student');
const axios = require('axios');
const readline = require('readline');

const CTX = {
    port: process.env.SERVER_PORT,
    url: `http://localhost:${process.env.SERVER_PORT}`
};

const app = EXPRESS();
app.use(EXPRESS.json());
app.post(HANDLERS_COMMON.signup.path, HANDLERS_COMMON.signup.handler);
app.post(HANDLERS_COMMON.login.path, HANDLERS_COMMON.login.handler);

app.get(HANDLERS_SCHOOL.listSchool.path, HANDLERS_SCHOOL.listSchool.handler);
app.post(HANDLERS_SCHOOL.createOwnSchool.path, HANDLERS_COMMON.verifyJWT, HANDLERS_SCHOOL.createOwnSchool.handler);
app.put(HANDLERS_SCHOOL.updateOwnSchool.path, HANDLERS_COMMON.verifyJWT, HANDLERS_SCHOOL.updateOwnSchool.handler);
app.get(HANDLERS_SCHOOL.getOwnSchools.path, HANDLERS_COMMON.verifyJWT, HANDLERS_SCHOOL.getOwnSchools.handler);

app.post(HANDLERS_SCHOOL.createOwnPost.path, HANDLERS_COMMON.verifyJWT, HANDLERS_SCHOOL.createOwnPost.handler);
app.get(HANDLERS_SCHOOL.getOwnPosts.path, HANDLERS_COMMON.verifyJWT, HANDLERS_SCHOOL.getOwnPosts.handler);
app.put(HANDLERS_SCHOOL.updateOwnPost.path, HANDLERS_COMMON.verifyJWT, HANDLERS_SCHOOL.updateOwnPost.handler);

app.post(HANDLERS_STUDENT.subscribe.path, HANDLERS_COMMON.verifyJWT, HANDLERS_STUDENT.subscribe.handler);
app.put(HANDLERS_STUDENT.unsubscribe.path, HANDLERS_COMMON.verifyJWT, HANDLERS_STUDENT.unsubscribe.handler);
app.get(HANDLERS_STUDENT.getSubscribes.path, HANDLERS_COMMON.verifyJWT, HANDLERS_STUDENT.getSubscribes.handler);
app.get(HANDLERS_STUDENT.getPosts.path, HANDLERS_COMMON.verifyJWT, HANDLERS_STUDENT.getPosts.handler);
app.get('/student/postall', HANDLERS_COMMON.verifyJWT, async (req, res, next) => {
    try {
        const { uid, auth } = req.user;
        if (auth !== AUTH.STUDENT) {
            return res.status(403).send('You do not have permission.');
        }

        const table = await loadDB(process.env.DB_SUBSCRIBE_PATH);
        const subscribes = table.readAll().filter(item => item.disable === false && item.uid === uid);
        if (subscribes.length === 0) {
            return res.json({
                code: 0,
                success: subscribes
            });;
        }

        const posts = await loadDB(process.env.DB_POST_PATH);
        res.json({
            code: 0,
            success: posts.readAll().
                filter(post => post.disable === false && subscribes.find(subscribe => subscribe.school === post.school && post.created > subscribe.updated))
        });
    }
    catch (e) {
        next(e)
    }
});

app.get('/jwt', HANDLERS_COMMON.verifyJWT, (req, res) => {
    res.json(req.user);
});
app.use(HANDLERS_COMMON.errorHandler);
app.listen(CTX.port, () => {
    console.log(`Server running at http://localhost:${CTX.port}`);
});







const requestParams = {
    headers: {
        Authorization: ``
    }
};
function test() {
    console.log('\n');
    console.log('-----------------------------------------------------------');
    console.log('You can use commands, please enter the commands as numbers.');
    console.log('-----------------------------------------------------------');
    if (requestParams.headers.Authorization.length !== 0) {
        console.log(`current account : ${requestParams.headers.Authorization}`);
    }
    console.log('-----------------------------------------------------------');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const menu = [
        'signup', 'login',
        'create school(only manaer)',
        'create post(only manaer)',
        'update post(only manaer)',
        'subscribe(only student)',
        'unsubscribe(only student)',
        'check post(only student)',
        'view post-all(only student)'
    ];
    console.log('Available commands:');
    console.log(menu.map((v, i) => `${i + 1}) ${v}`).join('\n'));

    rl.prompt();
    rl.on('line', async (line) => {
        console.log('');
        let res = null;
        try {
            switch (line.trim()) {
                case '1':
                    {
                        res = await testSignup(rl);
                    } break;
                case '2':
                    {
                        res = await testLogin(rl);
                        requestParams.headers.Authorization = `Bearer ${res.data.success}`;
                    } break;
                case '3':
                    {
                        res = await testCreateSchool(rl);
                    } break;
                case '4':
                    {
                        res = await testCreatePost(rl);
                    } break;
                case '5':
                    {
                        res = await testUpdatePost(rl);
                    } break;
                case '6':
                    {
                        res = await testSubscribe(rl);
                    } break;
                case '7':
                    {
                        res = await testUnsubscribe(rl);
                    } break;
                case '8':
                    {
                        res = await testViewPosts(rl);
                        const stringfy = res.data.success.sort((l, r) => r.created - l.created).map(i => `- ${JSON.stringify(i)}`).join('\n');
                        console.log(`ordered posts`)
                        console.log(`${stringfy}`)
                    } break;
                case '9':
                    {
                        res = await testViewPostAll(rl);
                        const stringfy = res.data.success.sort((l, r) => r.created - l.created).map(i => `- ${JSON.stringify(i)}`).join('\n');
                        console.log(`ordered posts`)
                        console.log(`${stringfy}`)
                    } break;
                default:
                    console.log(`Unknown command: '${line.trim()}'`); 2
            }


            console.log(`response is ${JSON.stringify(res.data)}`);
        }
        catch (e) {
            if (e instanceof Error && e.message === '/') { }
            else {
                console.error(`occur error : ${e}`);
            }
        }

        rl.close();
        test();
    });
}

async function question(rl, ask) {
    return new Promise((resolve, reject) => {
        rl.question(`(Go back'/') ${ask}`, answer => {
            if (answer === '/') {
                reject(new Error(answer));
            }
            else {
                resolve(answer);
            }

        });
    });
}

async function testSignup(rl) {
    const account = await question(rl, 'Account: ');
    const password = await question(rl, 'Password: ');
    const nick = await question(rl, 'Nick: ');
    let is_student = null;
    while (is_student === null) {
        const txt = await question(rl, 'Is Student? (y/n): ');
        switch (txt.trim()) {
            case 'y': {
                is_student = true;
            } break;
            case 'n': {
                is_student = false;
            } break;
            default:
                continue;
        }
    };


    return await axios.post(`${CTX.url}${HANDLERS_COMMON.signup.path}`, {
        account,
        password,
        is_student,
        nick
    });
}

async function testLogin(rl) {
    const account = await question(rl, 'Account: ');
    const password = await question(rl, 'Password: ');

    let result = await axios.post(`${CTX.url}${HANDLERS_COMMON.login.path}`, {
        account,
        password
    });

    let verify = await axios.get(`${CTX.url}/jwt`, {
        headers: {
            'Authorization': `Bearer ${result.data.success}`
        }
    });

    console.log(`internal data of jwt : ${JSON.stringify(verify.data)}`);
    return result;
}


async function testCreateSchool(rl) {
    const name = await question(rl, 'name: ');
    const local = await question(rl, 'local: ');
    return await axios.post(`${CTX.url}${HANDLERS_SCHOOL.createOwnSchool.path}`, {
        name,
        local
    }, requestParams);
}

async function testCreatePost(rl) {
    const res = await axios.get(`${CTX.url}${HANDLERS_SCHOOL.getOwnSchools.path}`, requestParams);
    const ownString = res.data.success.map(item => `- ${JSON.stringify(item)}`).join('\n');
    console.log(`this is own schools\n${ownString}`);

    const school = await question(rl, 'school id: ');
    const title = await question(rl, 'title: ');
    const contents = await question(rl, 'contents: ');
    return await axios.post(`${CTX.url}${HANDLERS_SCHOOL.createOwnPost.path}`, {
        school,
        title,
        contents
    }, requestParams);
}

async function testUpdatePost(rl) {
    const res = await axios.get(`${CTX.url}${HANDLERS_SCHOOL.getOwnPosts.path}`, requestParams);
    const ownString = res.data.success.map(item => `- ${JSON.stringify(item)}`).join('\n');
    if (ownString.length === 0) {
        console.log(`There are no posts written by you.`);
        return res;
    }

    console.log(`this is own post\n${ownString}`);
    let params = null;
    while (params === null) {
        const txt = await question(rl, 'update or delete? (u/d): ');
        switch (txt.trim()) {
            case 'u': {
                const post = await question(rl, 'post id: ');
                const title = await question(rl, 'title(ignore is empty): ');
                const contents = await question(rl, 'contents(ignore is empty): ');
                params = { post };
                if (title.length !== 0)
                    params['title'] = title;
                if (contents.length !== 0)
                    params['contents'] = contents;
            } break;
            case 'd': {
                const post = await question(rl, 'post id: ');
                params = { post, disable: true };
            } break;
            default:
                continue;
        }
    };
    return await axios.put(`${CTX.url}${HANDLERS_SCHOOL.updateOwnPost.path}`, params, requestParams);
}


async function testSubscribe(rl) {
    const schools = await axios.get(`${CTX.url}${HANDLERS_SCHOOL.listSchool.path}`);
    const subscribes = await axios.get(`${CTX.url}${HANDLERS_STUDENT.getSubscribes.path}`, requestParams);
    const unsubscribes = schools.data.success
        .filter(school => subscribes.data.success.find(item => item.id === school.id) == null);
    const ownString = unsubscribes.map(item => `- ${JSON.stringify(item)}`).join('\n');
    if (ownString.length === 0) {
        console.log(`There are no schools available for subscription.`);
        return subscribes;
    }

    console.log(`Schools available for subscription\n${ownString}`);
    const school = await question(rl, 'school id: ');
    return await axios.post(`${CTX.url}${HANDLERS_STUDENT.subscribe.path}`, {
        school
    }, requestParams);
}

async function testUnsubscribe(rl) {
    const res = await axios.get(`${CTX.url}${HANDLERS_STUDENT.getSubscribes.path}`, requestParams);
    const ownString = res.data.success.map(item => `- ${JSON.stringify(item)}`).join('\n');
    if (ownString.length === 0) {
        console.log(`There are no schools subscribed to.`);
        return res;
    }

    console.log(`Schools currently subscribed to\n${ownString}`);
    const school = await question(rl, 'school id: ');
    return await axios.put(`${CTX.url}${HANDLERS_STUDENT.unsubscribe.path}`, {
        school
    }, requestParams);
}

async function testViewPosts(rl) {
    const res = await axios.get(`${CTX.url}${HANDLERS_STUDENT.getSubscribes.path}`, requestParams);
    const ownString = res.data.success.map(item => `- ${JSON.stringify(item)}`).join('\n');
    if (ownString.length === 0) {
        console.log(`There are no schools subscribed to.`);
        return res;
    }

    console.log(`Schools currently subscribed to\n${ownString}`);
    const school = await question(rl, 'school id: ');
    return await axios.get(`${CTX.url}${HANDLERS_STUDENT.getPosts.path}?school=${school}`, requestParams);
}

async function testViewPostAll(rl) {
    return await axios.get(`${CTX.url}/student/postall`, requestParams);
}

setTimeout(_ => test(), 1000);