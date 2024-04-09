module.exports = {
    AUTH: {
        MANAGER: 0xffff,
        STUDENT: 0x0010,
        GUEST: 0x0001,
        UNKNOWN: 0x0000,
    },

    USER: {
        uid : 0,
        account : '',
        password : '',
        auth : 0,
        nick : '',
        disable : false,
        created : Date.now(),
        updated : Date.now(),
    },

    SCHOOL: {
        id : 0,
        owner : 0,
        name : 'test',
        local : 'korea',
        disable : false,
        created : Date.now(),
        updated : Date.now(),
    },

    POST : {
        id : 0,
        school : 0,
        owner : 0,
        disable : false,
        title : 'test',
        contents : 'test',
        created : Date.now(),
        updated : Date.now(),
    },

    SUBSCRIBE: {
        id : 0,
        uid : 0,
        
        school : 0,
        disable : false,
        created : Date.now(),
        updated : Date.now(),
    }
}