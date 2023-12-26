
const http = require('http')


const data = [
    {name:'jayesh', email : 'jayesh@test.com'},
    {name:'arkam', email : 'arkam@test.com'},
    {name:'kedar', email : 'kedar@test.com'},
]

http.createServer((req,res) =>{
    console.log(req);
    // res.write("Hello, welcome to the Home page.")
    res.write(JSON.stringify(data))
    res.end();
}).listen(5500,()=>{
    console.log("server is created on server port : 5500");
})

