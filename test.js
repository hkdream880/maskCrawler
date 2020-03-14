var axios = require('axios');
var cheerio = require('cheerio');
var data = require('./data/url.json');


const requestHtml = async (path)=>{
  axios.get(path)
  .then((res)=>{
    const $ = cheerio.load(res.data);
    const prodImg = $('dt.prd_name strong').text()
    const prodName = $('.img_va img').attr('src')
    const prodStatus = $('.not_goods').length > 0 ? false : true;
    console.log(prodImg)
    console.log(prodName)
    console.log(prodStatus)
  })
  .catch((err)=>{
    console.log(err)
  })
}

requestHtml(data.urlList[0])

//requestHtml('https://smartstore.naver.com/woodmilli/products/4414445027?NaPm=ct%3Dk7qe27vs%7Cci%3Db967552463e7887ebe85ead0fbd62d77269516bf%7Ctr%3Dsls%7Csn%3D204500%7Chk%3Df5233d49f4812887695bd326ce56d5a2d6cb8e0e')