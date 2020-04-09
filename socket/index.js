const SocketIO = require('socket.io');

module.exports = (server,app) => {
  
  const io = SocketIO(server,{
    path : '/socket',
    //transports : ['websocket']  //브라우저의 웹소켓 사용 가능 여부 확인 skip을 원할 경우(기본적으료 확인 후 사용x일경우 폴링 사용 가능 할 경우 websocket 연결)
  });
  app.set('io',io); //추후 라우터에서 io를 빼오고 이벤트 emit을 위해... ex : req.app.get('io').of('/room').emit
  
  const maskSocket = io.of('/maskSocket');  //새로운 채팅 알림을 위해
  console.log('socket init')
  
  maskSocket.on('connection',(socket)=>{
    socket.on('disconnect',()=>{
      console.log('room disconnect');
    });
  });  
};