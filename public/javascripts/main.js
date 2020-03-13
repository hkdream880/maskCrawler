function Main($root){
  this.$root = $root;
  this._init();
}

Main.prototype = {
  _interval : null, 
  _count: null,
  _path : null,
  _intervalCount: 0,
  _init: function(){
    this._bindEvent();
  },
  _bindEvent: function(){
    this.$root.on('click','#doCroll',$.proxy(this._excuteCrolling,this))
    this.$root.on('click','#stopCroll',$.proxy(this._stopCrolling,this))
  },

  _excuteCrolling: function(){
    console.log('crolling activated')
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
    var formValue = this.$root.find('#targetForm').serialize()
    var minueteVal = this.$root.find('#interval').val()
    this._count = this.$root.find('#count').val()
    this._path = this.$root.find('#path').val()
    

    this._interval = setInterval($.proxy(this._doCrolling,this),minueteVal*10000,formValue)

  },
  _doCrolling : function(param){
    console.log(param)
    this._intervalCount++
    axios.get('/croll/phantom?'+param+'&intervalCount='+this._intervalCount)
    .then($.proxy(function (response) {
      console.log(this._count)
      console.log(response.data.count);
      if(parseInt(response.data.count) < this._count){
        window.open(this._path)
        new Notification("판매 시작 !");
        this._stopCrolling()
      }
    },this))
    .catch(function (error) {
      console.log(error);
    })
  },

  _stopCrolling: function(){
    clearInterval(this._interval)
  }

}