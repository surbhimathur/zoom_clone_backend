const app= require("express")();
const server= require("http").createServer(app);
const cors= require("cors");

const io= require("socket.io")(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

app.use(cors());

const PORT= process.env.PORT || 5000;

app.get("/",(req, res) =>{
    res.send('Server is running');
    
});


io.on('connection',(socket)=>{
    socket.emit('me',socket.id);
    
    socket.on("endCall", ({ id }) => {
        io.to(id).emit("endCall");
      });
    
    socket.on("calluser",({userToCall,signalData,from,name})=>{
        io.to(userToCall).emit("calluser",{signal:signalData,from,name});
    });

    socket.on("answercall",(data)=>{
        socket.broadcast.emit("updateUserMedia", {
            type: data.type,
            currentMediaStatus: data.myMediaStatus,
          });
        io.to(data.to).emit("callaccepted",data.signal);
    });
    socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
        
        socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus });
      });
    
});









server.listen(PORT,()=>console.log(`server is listening on port ${PORT}`));

