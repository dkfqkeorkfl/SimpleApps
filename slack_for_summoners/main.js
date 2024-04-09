require('dotenv').config();
const EXPRESS = require('express');
const REQUEST = require('teeny-request').teenyRequest;
const PUPPETEER = require('puppeteer');
const SLACKBOT = require('@slack/web-api').WebClient;

const param = {
  sid: process.env.SID,
  gid: process.env.GID,
  key: process.env.GOOGLEAPI_KEY,
  token: process.env.SLACK_TOKEN
}

const context = {
  dictionary: new Map(),
  note: new Set(),
}

const web = new SLACKBOT(param.token);
async function sendMessage(channel, message) {
  return await web.chat.postMessage({
    channel: channel,
    text: message,
  });
}

function request(options) {
  return new Promise((resolve, reject) => {
    REQUEST(options, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

(async () => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${param.sid}/values/${param.gid}?key=${param.key}`;
  try {
    let { body } = await request({ url: url });
    const json = JSON.parse(body);
    context.dictionary = new Map(json.values);
  }
  catch (e) {
    console.error(e);
  }
})();

const app = EXPRESS();
app.use(EXPRESS.urlencoded({ extended: false }));
app.use(EXPRESS.json());
app.post('/message', (req, res) => {
  const { command, text } = req.body;
  let value = context.dictionary.get(text);
  if (value == null) {
    value = `다음의 키만 사용이 가능합니다.\n${Array.from(context.dictionary.keys()).join('\n')}`
  }

  res.json({
    response_type: "in_channel",
    text: value
  });
});
app.listen(3000, () => console.log('node on 3000'));




async function countElement(url) {
  const browser = await PUPPETEER.launch();
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForSelector('li._');

  // Fetch all 'li._' elements, but exclude those that also have the '_fixed' class
  const links = await page.$$eval('li._', liElements =>
    liElements
      // Filter out elements with the '_fixed' class
      .filter(li => !li.classList.contains('_fixed'))
      // Map the remaining elements to their contained 'a.tit' href values
      .map(li => {
        const anchor = li.querySelector('a.tit');
        return anchor ? anchor.href : '';
      })
      // Filter out any falsey values resulting from li elements without a.tit anchors
      .filter(href => href)
  );

  await browser.close();
  return links;
}

async function collectPage() {
  const event = await countElement('https://community.summonerswar.com/chronicles/kor-gb/board/49');
  const update = await countElement('https://community.summonerswar.com/chronicles/kor-gb/board/16');
  const note = await countElement('https://community.summonerswar.com/chronicles/kor-gb/board/17');
  const combinedSet = new Set([...event, ...update, ...note]);
  if (context.note.size != 0) {
    for (const item of combinedSet) {
      if (!context.note.has(item)) {
        await sendMessage('C06QX72H8BS', item);
      }
    }
  }

  if (combinedSet.size == 60)
    context.note = combinedSet;
};

(async () => {
  try {
    await collectPage();
  }
  catch (e) {
    console.error(e);
  }

})();

setInterval(async () => {
  try {
    await collectPage();
  }
  catch (e) {
    console.error(e);
  }
}, 600000);