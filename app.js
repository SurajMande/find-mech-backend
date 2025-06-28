const express = require('express')
const app = express()
const cors = require('cors')
const { connectDB } = require('./config/db')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());
connectDB();
const AuthRouter = require('./routes/AuthRouter')

app.get('/', (req, res)=>{
    res.send('hello');
})

app.use('/auth', AuthRouter)

app.listen(8080, ()=>{
    console.log('server started');
    
})