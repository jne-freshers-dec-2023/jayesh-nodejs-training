
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
        
        const body = []
        req.on('data',(chunk) =>{
            console.log(chunk);
            body.push(chunk)
        })

        req.on('end',() => {
            const parseBody = Buffer.concat(body).toString()
            console.log(parseBody);
            const message = parseBody.split('=')[1];
            fs.writeFileSync('message.txt',message)
        })

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

}).listen(8002, ()=> {
    console.log('server is listening on port : 8002');
})