const SocketIO = require('socket.io');

module.exports = (server,app) => {
  
  const io = SocketIO(server,{
    path : '/socket'
  });
  app.set('io',io);
  
  const maskSocket = io.of('/maskSocket');
  console.log('socket init')
  
  maskSocket.on('connection',(socket)=>{
    socket.on('disconnect',()=>{
      console.log('maskSocket disconnect');
    });
  });  
};