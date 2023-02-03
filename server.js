const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {

  const checkShortUrl = req.body.shortUrl;
  const ShortUrlExists = await ShortUrl.findOne({short: checkShortUrl }).exec();
  if (ShortUrlExists) { 
    return res.status(409).json({"message": "Customized shortUrl already in use"})//conflict
  }
  else {
    await ShortUrl.create({ full: req.body.fullUrl, short: req.body.shortUrl })
    res.redirect('/')
  }; 
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 3000);