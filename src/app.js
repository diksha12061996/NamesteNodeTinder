const express = require('express');
const app = express();

app.get('/users',(req,res)=>{
    res.send({FirstName:"Deeksha",LastName:"Rajput"})
})
app.delete('/users',(req,res)=>{
    res.send('Delete successfully')
});
app.post('/users',(req,res)=>{
    res.send("update successfully.")
})

app.use('/test',(req,res)=>{
    res.send("test from server")
})

app.listen(3000,()=>{
    console.log('server is listening on port 3000')
})