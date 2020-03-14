const express = require('express')
const router = express.Router()
const urlList = require('../data/url.json').urlList
const util = require('../common/util')


/* GET home page. */
router.get('/', async (req, res, next) => {
  let prodInfoList = []

  const promises = urlList.map(async (url)=>{
    let tempVal = await util.getProdInfo(url)
    prodInfoList.push(tempVal)
  })
  await Promise.all(promises)
  
  res.render('index.html', { title: 'Mask Hunter', prodInfoList });
});

module.exports = router;
