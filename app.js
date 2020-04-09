const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const crawlRouter = require('./routes/crawl');
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const job = require('./schedule')
const {urlList} = require('./data/url.json')
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
  res.render('error');
});



const schedule = async ()=>{
  const browser = await puppeteer.launch();
  let i = 0
  let returnData = [];
  console.log("urlList.length :",urlList.length)
  const delayLoop = async ()=>{
    console.log('test : ',i)
    const page = await browser.newPage();
    await page.goto(urlList[i].url)
    .then(async (res)=>{
      await page.reload()
      const html = await page.$eval( "body", e => e.outerHTML );
      const $ = cheerio.load( html );
      const crawlTime = new Date()
      console.log(i,' / success : ',crawlTime)
      returnData.push({
        prodImg: $(urlList[i].imgEl).attr('src'),
        prodName: $(urlList[i].titleEl).text(),
        prodStatus:  $(urlList[i].soldOutEl).length > 0 ? false : true,
        prodPath: urlList[i].url,
        crawlTime
      })
      setTimeout(async ()=>{
        if(i < urlList.length){
           delayLoop()
        }else{
          browser.close()
          console.log(returnData)
          app.get('io').of('/maskSocket').emit('newData',returnData)
        }
      },1000)
    })
    .catch( async (e)=>{
      console.log('error : ',i)
      if(i < urlList.length){
          delayLoop()
      }else{
        browser.close()
        console.log(returnData)
          app.get('io').of('/maskSocket').emit('newData',returnData)
      }
    })
    
    ++i
  }  
  delayLoop()
}
job(schedule)

module.exports = app;
