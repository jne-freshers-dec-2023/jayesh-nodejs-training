
// Event Module 
// Node .js has build-in module, called "Events",
// Where you can create-, fire- and listen for- your own events.

const http = require('http')
const EventEmitter = require('events')    // EventEmitter - is a class

const event = new EventEmitter();    

let count = 0;

event.on('countApi',()=>{       // Registering Listeners  ( eventName, listenerFunction-event handler)
    ++count;
    console.log("Event Called.",count);
})

const server = http.createServer((req,res) =>{

    const url = req.url;

    if(url === '/'){      // event producer
        console.log("Home Page");     
        res.write("Home page")
        event.emit("countApi")     // emit - to fire event - Emitting Events
        res.end()
    }else if(url === '/about'){     
        console.log("About Page");
        res.write("About page")
        event.emit("countApi")
        res.end()
    }else if(url === '/help'){
        console.log("Help Page");
        res.write("Help page")
        event.emit("countApi")
        res.end()
    }else{
        console.log("Page Not found.");
        res.write("Page Not found.")
        event.emit("countApi")
        res.end()
    }

}).listen(5555,() =>{
    console.log("server is listening on port : 5555");
})

