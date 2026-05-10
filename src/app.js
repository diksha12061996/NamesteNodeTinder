const express = require('express');
const app = express();

app.post('/users',(req,res)=>{
    res.send({FirstName:"Deeksha",LastName:"Rajput"})
})
app.delete('/users',(req,res)=>{
    res.send('Delete successfully')
});
app.get('/users',(req,res,next)=>{
    console.log('1st response');
    next();
    // res.send("update successfully.")
},
(req,res,next)=>{
     console.log('2nd response');
   res.send("2nd response")

}
)

app.use('/test',(req,res)=>{
    res.send("test from server")
})

app.listen(3000,()=>{
    console.log('server is listening on port 3000')
})