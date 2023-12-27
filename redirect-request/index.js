
const http = require('http')

const fs = require('fs')

const server = http.createServer((req,res) => {
    const url = req.url;
    const method = req.method;

    if(url === '/'){
        res.write('<html')
        res.write('<head><title>Node js</title></head>')
        res.write('<body><form action="/message" method="post"><input type="text" name="message" ><button type="submit">Submit</button></form></body>')
        res.write('</html>')
        return res.end();
    }

    if(url === '/message' && method === 'POST'){
        fs.writeFileSync('message.txt',"Dummy message.")
        res.statusCode = 302;
        res.setHeader('Location','/')
       return res.end()
    }

    res.setHeader('Content-type','text/html')
    res.write('<html lang="en">')
    res.write('<html lang="en"><head><title>Node js</title></head>')
    res.write('<body>Hello from Node js !</body>')
    res.write('</html>')
    res.end();

}).listen(8001, ()=> {
    console.log('server is listening on port : 8001');
})