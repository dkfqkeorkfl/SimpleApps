require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { Translate } = require('@google-cloud/translate').v2;
const FS = require('fs');

const CFG = {
    BOT_TOKEN: process.env.TELE_TOKEN,
    TRANS_KEY: process.env.GOOGLEAPI_KEY,
    FILENAME: process.env.FILENAME
}

function loadCsvIntoMap(filename) {
    const map = new Map();

    // Read the CSV file
    const fileContent = FS.readFileSync(filename, 'utf8');

    // Split the content into lines
    const lines = fileContent.split('\n');

    // Iterate over each line
    for (const line of lines) {
        const [key, value] = line.split(',');
        if (key && value) {
            map.set(key.trim(), value.trim());
        }
    }

    return map;
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(CFG.BOT_TOKEN, { polling: true });
const translate = new Translate({ key: CFG.TRANS_KEY });
const map = loadCsvIntoMap(CFG.FILENAME);

// Listen for any kind of message
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (msg.text == null || msg.text.startsWith('/')) {
        return; // Ignore commands here
    }

    try {
        let [detection] = await translate.detect(msg.text);
        let target = map.get(detection.language);
        if (target == null) {
            if (detection.language == 'en' || detection.language == 'und')
                return;
            target = 'en'
        }

        let [converted] = await translate.translate(msg.text, target);
        bot.sendMessage(chatId, `origin : ${msg.text}\nconverted : ${converted}`);
    }
    catch (error) {
        bot.sendMessage(chatId, `occur error : ${error}`);
    }
});

bot.onText(/\/insert (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const pairs = match[1].split(' '); // Split the message into pairs

    pairs.forEach(pair => {
        const [source, target] = pair.split('-'); // Split each pair into source and target
        if (source && target) {
            map.set(source, target);

        }
    });

    // Format and send the updated list
    const keyValueStrings = Array.from(map, ([key, value]) => `- ${key} : ${value}`);
    bot.sendMessage(chatId, `updated list\n${keyValueStrings.join('\n')}`);
});

bot.onText(/\/delete (\w+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const [target] = match;
    map.delete(target);

    const keyValueStrings = Array.from(map, ([key, value]) => `- ${key} : ${value}`);
    bot.sendMessage(chatId, `updated list\n${keyValueStrings.join('\n')}`);
});

