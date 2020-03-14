const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer')
const consts = require('../common/const')
const util = require('../common/util')

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


router.get('/refresh', async (req, res, next) =>{
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

router.get('/naver-market', async (req, res, next) =>{
  try {
    if(req.query.path.indexOf(consts.naverMarket.regExp) < 0){
      throw consts.errorMsg.pathErr
    }
    const resultVal  = await util.getProdInfo(req.query.path)
    res.status(200).json({result: 200, data: resultVal})
  } catch (error) {
    res.status(200).json({result: 500, err: error})
  }
});

const getHtml = async (path) => {
  try {
    return await axios.get(path);
  } catch (error) {
    console.error(error);
  }
};


module.exports = router;
