const express = require('express');
const app = express();
const server = require('http').createServer(app);
const {Server}= require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const path= require('path')
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});


// -------------deployment
const __dirname1=path.resolve();
// if(pr)
io.on('connection', (socket) => {
    socket.emit('me', socket.id);
    console.log('user connected');
    console.log(socket.id);


    socket.on('updateMyMedia', (data) => {
        io.to(data.userToUpdate).emit('updateUserMedia', data.data);
    });

    socket.on('calluser', ({userToCall,from, name, signal, documentId}) => {
        // console.log(userToCall,'\n', from, name, signal, documentId)
        // console.log(userToCall, from, name,signal, documentId);
        io.to(userToCall).emit('calluser', { signal, from, name, documentId});
    });

    socket.on('answercall', (data) => {
        io.to(data.io).emit('updateUserMedia', {
            type: data.type,
            mediaStatus: data.mediaStatus,
        });
        io.to(data.to).emit('callaccepted', data.signal, data.name);
    });

    socket.on('send-changes', (delta, userId) => {
        console.log(userId);
        io.to(userId).emit('receive-changes', delta);
    });

    socket.on('send-message', (data) => {
        io.to(data.userToSend).emit('receive-message', data.data);
    });

    socket.on('callended', (userToUpdate) => {
        io.to(userToUpdate).emit('callended');
        console.log('user disconnected');
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('call ended');
        console.log('call ended');
    })
})


app.get('/', (req, res) => {
    res.send('Server is running');
});
server.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));