const express = require('express')
const router = express.Router()
const fs = require('fs')



/* GET home page. */
router.get('/', async (req, res, next) => {
  const prodInfoList = JSON.parse(fs.readFileSync('./data/result.json', 'utf8'));
  res.render('index.html', { title: 'Mask Hunter', prodInfoList });
});

module.exports = router;
