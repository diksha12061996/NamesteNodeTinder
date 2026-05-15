const express = require('express');
const app = express();
const connectDB=require('./config/database');

connectDB().then(()=>{
app.listen(3000,()=>{
    console.log('server is listening on port 3000')
})
}).catch((err)=>{
    console.err('failed to connect')
})

