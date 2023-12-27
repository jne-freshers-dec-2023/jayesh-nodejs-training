const express = require('express')
const app = express();

app.get('',(req,res)=>{
    // console.log(req.query);
    console.log(req.query.name);
    res.send('Welcome to the home page.')
})

app.get('/about',(req,res)=>{
    res.send('Welcome to the about page.')
})

app.get('/help',(req,res)=>{
    res.send('Welcome to the help page.')
})

app.listen(3000,()=>{
    console.log("server is listening on port : 3000");
})