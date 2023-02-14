const express = require('express');
const ms = require('ms');
const app = express();
const puppeteer = require('puppeteer');

function removeFollowers(str) {
  return str.replace(/\s*K\s*followers\s*/, '');
}

let browser;

app.get('/', async (req, res) => {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto('https://www.linkedin.com/in/birobirobiro/?original_referer=', {
      waitUntil: 'load',
      setTimeout: ms('0s'),
    });

    await page.waitForTimeout('5ms');

    await page.waitForSelector('span[class^="top-card__subline-item"');
    const followersCount = await page.$eval('span[class^="top-card__subline-item"', (el) => el.innerText);

    res.send({
      "followers": Number(removeFollowers(followersCount)) * 1000,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

