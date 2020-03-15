const Cron = require('cron')

const schedule = ()=>{
  console.log(new Date())
}
/*
Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11 (Jan-Dec)
Day of Week: 0-6 (Sun-Sat) 
*/
const job = new Cron.CronJob('00 * 00-23 * * 0-6',schedule,null,true,'Asia/Seoul')

job.start();
console.log('start')
schedule()


module.exports = job