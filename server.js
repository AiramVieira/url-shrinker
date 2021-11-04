require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Registration with interface
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

// Create in DB one object with the short url by interface
app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});

// Return all registrated URLs
app.get('/registered/urls', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  const response = shortUrls.map((r) => {
    return { fullUrl: r.full, shortUrl: r.short };
  });
  res.status(200);
  res.send(response);
});

// Create in DB one object with the short url by API
app.post('/shortify', async (req, res) => {
  let body = req.body;
  if (body.url) {
    if (!body.url.startsWith('https://')) {
      body.url = `https://${body.url}`;
    }

    await ShortUrl.create({ full: body.url }).then((result) => {
      if (result == null) return res.sendStatus(404);

      result = {
        full: result.full,
        short: result.short,
      };

      res.status(200);
      res.send(result);
    });
  } else {
    res.status(500);
    res.send('Url not defined');
  }
});

// Return the info from URL
app.post('/url_info', async (req, res) => {
  let url_info = await ShortUrl.findOne({ full: req.body.url });

  if (url_info == null) return res.sendStatus(404);

  url_info = {
    full: url_info.full,
    short: url_info.short,
  };

  res.status(200);
  res.send(url_info);
});

// Redirect to original URL
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);
