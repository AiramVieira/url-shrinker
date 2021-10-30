const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();
const uri =
  'mongodb+srv://Airam:FMjtzBkaVHOJtgBq@cluster0.tlx4i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('DB Connected'))
.catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  const shortUrls = ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', (req, res) => {
  ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', (req, res) => {
  const shortUrl = ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);
