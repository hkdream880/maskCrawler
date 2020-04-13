const Cron = require('cron')

/*
Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11 (Jan-Dec)
Day of Week: 0-6 (Sun-Sat) 
*/




module.exports = (callBack) => {
  
  new Cron.CronJob('00 */2 09-18 * * 0-6',callBack,null,true,'Asia/Seoul')
}