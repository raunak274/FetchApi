const express = require('express');
const parser = require('body-parser');
const fetch = require('node-fetch');
const responseTime = require('response-time');
const StatsD = require('node-statsd')
const path = require('path');
const url = "http://52.172.155.226:3000/user/new";
const rp = require("request-promise");

const stats = new StatsD()

const app = express();

var authToken = "";
async function fetching(){
    console.log(" fethcing called");
    rp(options)
        .then(parsed => parsed.data.auth_token)
        .then(auth_token => {authToken = auth_token})
        .catch(err => console.error(err));
}



var options = {
    method: 'POST',
    uri: url,
    body: {
        app_id: 'jhbdskjnkasJND'
    },
    json: true 
};
var headers = {
    method: 'GET',
    uri: "http://52.172.155.226:3000/node/relayer",
    headers: {
        Authorization: authToken
    },
    json: true 
};

fetching();

app.use(responseTime(function (req, res, time) {
    var stat = (req.method + req.url).toLowerCase()
      .replace(/[:\.]/g, '')
      .replace(/\//g, '_')
    stats.timing(stat, time)
  }))

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())
app.use(function(req,res,next){
    res.locals.userValue = null;
    next();
})
 
app.set('view engine','ejs');
app.set('views','views');

app.get('/',function(req,res){
    res.render('home',{
        topicHead : 'API Form',
        data:""
    });
});


app.post('/getapi',(req,res)=> {
    const start_time = new Date().getTime();
    fetch(`${req.body.api}`)
    .then(res => res.status)
    .then(jsonData =>{
        const end_time = new Date().getTime();
        console.log("authtoken",authToken)
        res.render('home',{
            data: jsonData,
            time: end_time - start_time,
            authToken
        })
    })
    .then(fetching2())
    .catch(err => console.error(err))
});



async function fetching2(){
    rp(headers)
        .then(res => console.log('res'))
        .catch(err => console.error(err));
}

app.listen(5000);