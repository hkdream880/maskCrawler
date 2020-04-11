function Main($root, prodInfoList){
  this.maskSocket = null

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
    this._connectMaskSocket()
  },

  _connectMaskSocket: function(){
    var _this = this
    this.maskSocket = io.connect('http://localhost:3000/maskSocket', {
      path: '/socket',
    });
    this.maskSocket.on('newData',$.proxy(function(data){
      console.log('new date!!!!!!')
      console.log(data)
      for (var index = 0; index < data.length; index++) {
        this._crawlingSocketCallback(data[index],index)
      }
    },this));
  },

  _initializingProdInfo: function(){
    for(var i = 0; i<this._prodInfoList.length;i++){
      this._refreshProdCard(this._prodInfoList[i])
    }
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        new Notification("Hi there!");
      }
    });
  },

  _bindEvent: function(){
    this.$root.on('click','.link-btn',$.proxy(this._openLink,this))
  },

  _openLink: function(e){
    var link = $(e.currentTarget).data('link')
    window.open(link,'_blank','channelmode=yes')
  },

  _crawlingSocketCallback: function(data){
    this._prodInfoList[data.index].crawlTime = data.crawlTime?data.crawlTime:null
    this._prodInfoList[data.index].prodStatus = data.prodStatus
    this._prodInfoList[data.index].prodImg = data.prodImg
    this._refreshProdCard(data)
    if(this._prodInfoList[data.index].prodStatus === true){
      new Notification("판매 시작 !");
    }
  },

  _refreshProdCard: function(data){    
    this.$root.find('.timeString'+data.index).text(moment(data.crawlTime).format('YYYY MM DD, h:mm:ss a'))
    this.$root.find('#prod_img'+data.index).attr('src',data.prodImg)

    if(data.prodName.length > 25){
      this.$root.find('#prod_name'+data.index).text(data.prodName.substring(0,25)+'...')
    } else {
      this.$root.find('#prod_name'+data.index).text(data.prodName)
    }

    this.$root.find('.linkBtn'+data.index).removeClass('btn-danger')
    this.$root.find('.linkBtn'+data.index).removeClass('btn-primary')

    if(data.prodStatus === true){
      window.open(data.prodPath,'_blank','channelmode=yes')
      this.$root.find('.linkBtn'+data.index).addClass('btn-primary')
      this.$root.find('.linkBtn'+data.index).text('on sale')
      this.$root.find('#card'+data.index).addClass('bg-primary')
      setTimeout($.proxy(function(){
        this.$root.find('#card'+data.index).removeClass('bg-primary')
      },this),500)
    }else{
      this.$root.find('.linkBtn'+data.index).addClass('btn-danger')
      this.$root.find('.linkBtn'+data.index).text('sellout')
      this.$root.find('#card'+data.index).addClass('bg-danger')
      setTimeout($.proxy(function(){
        this.$root.find('#card'+data.index).removeClass('bg-danger')
      },this),500)
    }
  }


}