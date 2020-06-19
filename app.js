const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const crawlRouter = require('./routes/crawl');
const puppeteer = require('puppeteer')
const fs = require('fs')
const intervalPromise = require('interval-promise')

const {urlList} = require('./data/url.json')
const job = require('./schedule')
const { crawlSuccessCalback } = require('./common/util')
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/vendor',[
  express.static(__dirname + '/node_modules/axios/dist/'),
  express.static(__dirname + '/node_modules/jquery/dist/'),
  express.static(__dirname + '/node_modules/bootstrap/dist/'),
  express.static(__dirname + '/node_modules/popper.js/dist/umd/'),
  express.static(__dirname + '/node_modules/moment/min/')
])

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/crawl', crawlRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.html');
});

const crawling = async (i,browser,resultData)=>{
  console.log('start : ',i)
  console.time('crawler'+i);
  const page = await browser.newPage()
  page.setDefaultTimeout(5000)
  let returnData = {
    prodImg: '/images/fail.jpg',
    prodName: 'failed',
    prodStatus: false,
    prodPath: urlList[i].url,
    index: i,
    crawlTime: 'failed'
  }

  await page.goto(urlList[i].url)
  .then(async ()=>{
    console.log('urlList[i].refreshFlag : ',urlList[i].refreshFlag)
    if(urlList[i].refreshFlag){
      await page.reload()
      .then(async (res)=>{
        returnData = await crawlSuccessCalback(page,urlList[i],i);
        resultData.push(returnData)
        app.get('io').of('/maskSocket').emit('newData',[returnData])
        console.timeEnd('crawler'+i)
      })
      .catch(async (err)=>{
        console.timeEnd('crawler'+i)
        console.log('finish catch2222')
        resultData.push(returnData)
      })
    }else{
      returnData = await crawlSuccessCalback(page,urlList[i],i);
      resultData.push(returnData)
      app.get('io').of('/maskSocket').emit('newData',[returnData])
      console.timeEnd('crawler'+i)
    }
  })
  .catch(async (err)=>{
    console.log('finish catch1111')
    resultData.push(returnData)
    console.timeEnd('crawler'+i)
  })
}


const maskCrawling = async (jobFlage)=>{
  console.time("startCrawling");
  console.log("startCrawling jobFlage : ",jobFlage)
  const browser = await puppeteer.launch({args:['--no-sandbox', '--disable-setuid-sandbox']})
  const resultData = []
  let i = 0;
  await intervalPromise(async()=>{
    await crawling(i,browser,resultData)      
    ++i
  },2000,{iterations: urlList.length})

  console.log('method over!!!!!!!!!!!!')
  
  browser.close()
  // app.get('io').of('/maskSocket').emit('newData',resultData)
  
  console.timeEnd('startCrawling')
  fs.writeFile('./data/result.json',JSON.stringify(resultData),'utf8',function(){
    console.log('file write finish!!!')
  })
  if(jobFlage){
    console.log('cron job start')
    job(maskCrawling)
  }
}

//maskCrawling(true)
job(maskCrawling)


module.exports = app;
