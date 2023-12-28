const http = require('http')

const server = http.createServer((req,res) =>{

    if(req.url === '/'){
        res.end('Home Page')
    }

    if(req.url === '/about'){
        // blocking code - synchronous code
        for (let i = 0; i < 1000; i++) {
            for (let j = 0; j < 10000; j++) {
              console.log(`${i} ${j}`);      
            }            
        }
        res.end('About Page')
    }

    else if(req.url === '/about'){
        res.end('About Page')
    }


    else if(req.url === '/help'){
        res.end('Help Page')
    }

    else{
        // res.writeHead(404)
        res.end("<h1>Page Not Found.</h1>")
    }
})

server.listen(8000, ()=> {
    console.log('server is listening on port : 8000');
})