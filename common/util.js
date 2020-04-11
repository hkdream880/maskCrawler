const cheerio = require('cheerio')

const crawlSuccessCalback = async (page, target, idx) => {
  const html = await page.$eval( "body", e => e.outerHTML )
  const $ = cheerio.load( html );
  
  console.log('finish success')
  const crawlTime = new Date()
  const prodImg = $(target.imgEl).attr('src')
  const prodName = $(target.titleEl).text()
  const prodStatus = $(target.soldOutEl).length > 0 ? false : true
  const prodPath = target.url
  const returnData = {
    prodName,
    prodStatus,
    prodPath,
    index: idx,
    crawlTime : new Date(),
    prodImg: $(target.imgEl).attr('src').indexOf('http')>=0?prodImg:'http://www.welkeepsmall.com/'+prodImg
  }
  
  return returnData
}

module.exports = { crawlSuccessCalback }