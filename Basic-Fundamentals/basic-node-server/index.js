
const http = require('http')

http.createServer((req,res) =>{
    res.write("Hello this is jayesh gangurde.")
    res.end();
}).listen(5000,()=>{
    console.log("server is created on server port : 5000");
})
