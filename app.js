const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { connectDB } = require('./config/db')
const { setupSocket } = require('./sockets/socketHandler');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Make io accessible in controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});
// Socket.io setup
setupSocket(io);

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());

connectDB();

const AuthRouter = require('./routes/AuthRouter');
const broadcastRoutes = require('./routes/broadcastRoutes');

app.get('/', (req, res)=>{
    res.send('hello');
})

app.use('/auth', AuthRouter)
app.use('/broadcast', broadcastRoutes);

PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`server started at ${PORT}`);
    
})