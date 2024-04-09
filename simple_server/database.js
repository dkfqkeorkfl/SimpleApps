require('dotenv').config();
const FS = require('fs').promises;
const { parse: PARSE } = require('csv-parse/sync');
const { stringify: STRINGIFY } = require('csv-stringify/sync');
const { readFileOrCreate } = require('./util');

class Database {
    constructor() {
        this.data = [];
        this.path = '';
    }

    async load(path) {
        const txt = await readFileOrCreate(path, 'utf-8');
        this.path = path;
        this.data = PARSE(txt, {
            columns: true,
            skip_empty_lines: true
        });

        this.data.forEach(item => {
            for (const key of Object.keys(item)) {
                const v = item[key];
                switch (v) {
                    case 'True':
                    case 'TRUE':
                    case 'true': {
                        item[key] = true;
                    } break;
                    case 'False':
                    case 'FALSE':
                    case 'false': {
                        item[key] = false;
                    } break;
                    default: {
                        const n = Number.parseInt(v);
                        if (Number.isInteger(n)) {
                            item[key] = n;
                        }
                    } break;
                }
            }
        })
        return this;
    }

    async save() {
        let csv = this.data.map(item => {
            const changes = {};
            for (const key of Object.keys(item)) {
                const v = item[key];
                if (v === true || v === false) {
                    changes[key] = String(v);
                }
            }
            return Object.assign({}, item, changes);
        });
        const csvString = STRINGIFY(csv, { header: true });
        await FS.writeFile(this.path, csvString, 'utf-8');
        return this;
    }

    write(record) {
        this.data.push(record);
        return this;
    }

    readAll() {
        return this.data;
    }
}

module.exports = {
    loadDB: async (path) => {
        const db = new Database();
        return await (await db.load(`${path}.csv`));
    },
};