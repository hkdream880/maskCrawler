function Main($root, prodInfoList){
  this._prodInfoList = JSON.parse(prodInfoList.replace(/&#34;/gi,'"'))
  this.$root = $root;
  this._init();
}
/*
link-btn
scan-btn
*/

Main.prototype = {

  _init: function(){
    this._bindEvent();
    this._initializingProdInfo();
    console.log(io)
    this._connectMaskSocket()
  },
  _connectMaskSocket: function(){
    this.maskSocket = io.connect('http://localhost:3000/maskSocket', {
      path: '/socket',
    });
    this.maskSocket.on('newData',$.proxy(function(data){
      console.log(data)
    },this));
  },
  _initializingProdInfo: function(){
    for(var i = 0; i<this._prodInfoList.length;i++){
      this._prodInfoList[i].crawlingState = false
      this._prodInfoList[i].interval = null
      this._prodInfoList[i].intervalCnt = 0;
      this._refreshProdCard(i)
    }
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        new Notification("Hi there!");
      }
    });
  },

  _bindEvent: function(){
    this.$root.on('click','.link-btn',$.proxy(this._openLink,this))
    this.$root.on('click','.scan-btn',$.proxy(this._doScan,this))
    this.$root.on('click','#all_scan',$.proxy(this._doAllScan,this))
    this.$root.on('click','#all_stop',$.proxy(this._doAllStop,this))
  },

  _doAllScan: function(){
    console.log('_doAllScan')
    var totalMinVal = this.$root.find('#all_time_selector').val()
    if(totalMinVal === 'min'){
      alert('time is wrong')
      return 
    }
    for (var i = 0; i < this._prodInfoList.length; i++) {
      if(this._prodInfoList[i].crawlingState === false){
        this.$root.find('#time_selector'+i).val(totalMinVal)
        this.$root.find('#crawl_btn'+i).trigger('click')
      }
    }
  },

  _doAllStop: function(){
    for (var i = 0; i < this._prodInfoList.length; i++) {
      if(this._prodInfoList[i].crawlingState === true){
        this.$root.find('#crawl_btn'+i).trigger('click')
      }
    }
  },

  _doScan: function(e){
    var _this = this 
    var $target = $(e.currentTarget)
    var idx = $target.data('idx')
    var timeVal = _this.$root.find('.timeSelector'+idx).val()
    if(timeVal === 'min'){
      alert('time is wrong')
      return 
    }
    timeVal = parseInt(timeVal)
    if(_this._prodInfoList[idx].crawlingState === false){
      $target.children('.scan-loading').addClass('spinner-border')
      _this.$root.find('.timeSelector'+idx).attr('disabled','disabled')
      _this._prodInfoList[idx].interval = setInterval(function(){
        _this._excuteCrawling(idx)
      },60000 * timeVal)
      console.log('interval is running')
    }else{
      $target.children('.scan-loading').removeClass('spinner-border')
      _this.$root.find('.timeSelector'+idx).removeAttr('disabled')
      clearInterval(_this._prodInfoList[idx].interval)
      console.log('interval is cleared')
    }
    _this._prodInfoList[idx].crawlingState = !_this._prodInfoList[idx].crawlingState
  },

  _openLink: function(e){
    var link = $(e.currentTarget).data('link')
    window.open(link,'_blank','channelmode=yes')
  },

  _excuteCrawling : function(idx){
    axios.get('/crawl/naver-market',{
      params: {
        path: this._prodInfoList[idx].prodPath
      }
    })
    .then($.proxy(function(res){
      if(res.data.result === 200){
        this._crawlingSuccessCallback(res.data,idx)
      }else{
        this._crawlingErrorCallback(res.data,idx)
      }
    },this))
    .catch($.proxy(function(err){
      this._crawlingErrorCallback(err,idx)
    },this))
  },

  _crawlingSuccessCallback: function(res,idx){
    console.log('_crawlingSuccessCallback')
    console.log(res)
    ++this._prodInfoList[idx].intervalCnt
    this._prodInfoList[idx].crawlTime = res.data.crawlTime
    this._prodInfoList[idx].prodStatus = res.data.prodStatus
    this._refreshProdCard(idx)
    if(this._prodInfoList[idx].prodStatus === true){
      new Notification("판매 시작 !");
    }
  },

  _crawlingErrorCallback: function(err,idx){
    console.log('_crawlingErrorCallback')
    console.log(err)
  },

  _refreshProdCard: function(idx){
  
    this.$root.find('.timeString'+idx).text(moment(this._prodInfoList[idx].crawlTime).format('YYYY MM DD, h:mm:ss a'))
    this.$root.find('.countString'+idx).text(this._prodInfoList[idx].intervalCnt)

    this.$root.find('.linkBtn'+idx).removeClass('btn-danger')
    this.$root.find('.linkBtn'+idx).removeClass('btn-primary')

    if(this._prodInfoList[idx].prodStatus === true){
      window.open(this._prodInfoList[idx].prodPath,'_blank','channelmode=yes')
      this.$root.find('.linkBtn'+idx).addClass('btn-primary')
      this.$root.find('.linkBtn'+idx).text('on sale')
      this.$root.find('#card'+idx).addClass('bg-primary')
      setTimeout($.proxy(function(){
        this.$root.find('#card'+idx).removeClass('bg-primary')
      },this),500)
    }else{
      this.$root.find('.linkBtn'+idx).addClass('btn-danger')
      this.$root.find('.linkBtn'+idx).text('sellout')
      this.$root.find('#card'+idx).addClass('bg-danger')
      setTimeout($.proxy(function(){
        this.$root.find('#card'+idx).removeClass('bg-danger')
      },this),500)
    }
  }


}