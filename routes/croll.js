var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');
var puppeteer = require('puppeteer')
var fs = require('fs')
var path = require('path');

/* GET users listing. */
router.get('/', async (req, res, next) =>{
  try {
    const requestParam = req.query
    let returnValue
    await getHtml(requestParam.path)
    .then(html => {
      const $ = cheerio.load(html.data);
      returnValue = $(requestParam.parentEl).find(requestParam.targetEl).length
    })
    res.status(200).json({result: 200,count: returnValue})
  } catch (error) {
    res.status(200).json({result: 500, err: error})
  }
});


router.get('/phantom', async (req, res, next) =>{
  try {
    const requestParam = req.query
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(requestParam.path)
    await page.reload()
    const html = await page.$eval('body',e=>e.outerHTML)

    const $ = cheerio.load(html);
    const returnValue = $(requestParam.parentEl).find(requestParam.targetEl).length
    console.log(returnValue)
    await browser.close();

    res.status(200).json({result: 200, count: returnValue}) 
  } catch (error) {
    res.status(200).json({result: 500, err: error}) 
  }
})

const getHtml = async (path) => {
  try {
    return await axios.get(path);
  } catch (error) {
    console.error(error);
  }
};


function delay( timeout ) {
  return new Promise(( resolve ) => {
    setTimeout( resolve, timeout );
  });
}


module.exports = router;
