const express = require('express')
const router = express.Router()

const util = require('../common/util')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')


/* GET home page. */
router.get('/', async (req, res, next) => {
  let prodInfoList = []

  prodInfoList = [];

  res.render('index.html', { title: 'Mask Hunter', prodInfoList });
});

module.exports = router;
