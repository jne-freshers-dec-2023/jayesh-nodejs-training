const express = require('express')
const bodyParser = require('body-parser')

const app = express()



// create application/json parser
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(urlencodedParser);

app.use((req,res,next) => {
    console.log('Logging the request');
    next()
})

app.get('/',(req,res,next) => {
    res.send('This is the Home page.')
})

app.get('/user',(req,res,next) => {
    res.send('This is the user page.')
})

app.get('/user/add',(req,res) => {
    res.send(`<form method ="POST">
    <div><input name='username'/></div>
    <div><button> Add User </button></div>
    </form>`)
})

app.post('/user/add',(req,res) =>{
    console.log(req.body.username);
    console.log('Post request.');
})

app.listen(4000,() =>{
    console.log('Server is listening on port : 4000');
})