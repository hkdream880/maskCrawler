const axios = require('axios')
const cheerio = require('cheerio')
const consts = require('./const')
const puppeteer = require('puppeteer')

const getProdInfo = async (path) => {
  // return axios.get(path)
  // .then((res)=>{
  //   const $ = cheerio.load(res.data);
  //   const prodName = $(consts.naverMarket.targetNameEl).text()
  //   const prodImg = $(consts.naverMarket.targetImgEl).attr('src')
  //   const prodStatus = $(consts.naverMarket.targetStatusEl).length > 0 ? false : true;
    
  //   return {
  //     prodImg,
  //     prodName,
  //     prodStatus,
  //     prodPath: path,
  //     crawlTime: new Date()
  //   }
  // })
  // .catch((err)=>{
  //   console.log(err)
  //   return null
  // })
}

module.exports = { getProdInfo }