var responseTime = require('response-time');
const express = require('express');
const app = express();

app.set('view engine','ejs');
app.set('views','views'); 


require('dotenv').config();
const url1 = `${process.env.API_SERVER}/user/new`;
const url2 = `${process.env.API_SERVER}/node/relayer`;
const url3 = `${process.env.API_SERVER}/video/list_homepage?offset=0&limit=2`;
const url4 = `${process.env.API_SERVER}/resolve/claims`
const fetch = require("node-fetch");
var moment = require('moment');
////////////////////////////////////////////////////////////////////////////////
var newUser = {};
var nodeRelayer = {};
var videoList = {};
var resolveClaims = {};
async function fetching() {

    var start = moment().milliseconds();

    let dataObj = {
        "app_id": "jaehabkdkwenlk"
    }
    let headers = {
        "Content-type": "application/json"
    }
    let body = JSON.stringify(dataObj);

    let data = await fetch(url1, { method: "POST", headers: headers, body: body });
    var end = moment().milliseconds();
    data = await data.json();
    var time = end - start;
    // status = await data.status;
    console.log("\n >>>>>>>>>>>>>>>>>>>>>NEW USER>>>>>>>>>>>>>>>>>>>>>> \n")
    if (data.success == true) {
 
        newUser.data = data.data.auth_token;
        newUser.time = time;
        newUser.status = 200;

        console.log("status is 200\n");
        console.log("Time : ", time, " ms \n");
        console.log("data is \n", data);
        console.log("\n >>>>>>>>>>>>>>>>>>>>>>>>>>>> Node Relayer >>>>>>>>>>>>>>>>>>>>>>> \n")
        fetching2(data);
    }
    else {
        newUser.data = 'null';
        newUser.time = 'Err';
        newUser.status = 400;
        console.log("Status is 400, Bad request or File not found")
    }
    
}
/////////////////////////////////////////////////////////////////////////////////

fetching();

////////////////////////////////////////////////////////////////////////////////
async function fetching2(data1) {
    var start = moment().milliseconds();

    let headers1 = {
        "Authorization": data1.data.auth_token,
        'Content-type': 'application/json'
    }
    let data = await fetch(url2, { method: "GET", headers: headers1 });
    //console.log(headers1);
    var end = moment().milliseconds();
    data = await data.json();
    var time = end - start;
    if (data.success == true) {
        nodeRelayer.data = data.data.token;
        nodeRelayer.time = time;
        nodeRelayer.status = 200;
        console.log("status is 200\n");
        console.log("Time : ", time, " ms \n");
        console.log("data is \n", data);
        console.log("\n >>>>>>>>>>>>>>>>>>>>>>>>>>>Video List>>>>>>>>>>>>>>>>>>> \n")
        fetching3(headers1);
    }
    else {
        nodeRelayer.data = 'null';
        nodeRelayer.time = 'Err';
        nodeRelayer.status = 404;
        console.log("Status is 404, File not found or Bad request")
    }
}
/////////////////////////////////////////////////////////////////////////////////

async function fetching3(headers1) {
    var start = moment().milliseconds();

    let data = await fetch(url3, { method: "GET", headers: headers1 });
    var end = moment().milliseconds();
    //console.log(headers2);
    data = await data.json();
    var time = end - start;
    if (data.success == true) {
        videoList.data = data.data.Uris;
        videoList.time = time;
        videoList.status = 200;

        console.log("status is 200\n");
        console.log("Time : ", time, " ms \n");
        console.log("data is \n", data);
        fetching4(headers1, data.data.Uris)
    }
    else{
        videoList.data = 'null';
        videoList.time = 'Err';
        videoList.status = 404;
        console.log("Status is 404, Bad Request or File Not Found")  ;
    } 
}
//////////////////////////////////////////////////////////////////////////////////
async function fetching4(head, hash) {
    var start = moment().milliseconds();
    let dataObj = {
        "urls": hash
    }
    let headers = {
        "Content-type": "application/json",
        "Authorization": head
    }
    let body = JSON.stringify(dataObj);

    let data = await fetch(url4, { method: "POST", headers: headers, body: body });
    var end = moment().milliseconds();
    data = await data.json();
    var time = end - start;
    if(data.success){
        resolveClaims.time = time;
        resolveClaims.data = JSON.stringify(data);
        resolveClaims.status = 200;
        console.log("\n >>>>>>>>>>>>>>>>>>>>>>>>Resolve/Claims>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n")
        console.log("TCL: Time : ", time ," ms")
        console.log("TCL: fetching -> data", data)
    }
    else{
        resolveClaims.data = 'null';
        resolveClaims.time = 'Err';
        resolveClaims.status = 404;
        console.log("Status is 404, Bad Request or File Not Found")  ;
    } 
}

app.get('/new/user',(req,res) => {
    res.render('new-user',{result: newUser})
});

app.get('/node/relayer',(req,res) => {
    res.render('node-relayer',{result: nodeRelayer})
});
app.get('/resolve/claims',(req,res) => {
    res.render('resolve-claims',{result: resolveClaims})
});

app.get('/video/list',(req,res) => {
    res.render('video-list',{result: videoList})
});
app.get('/',(req,res) => {
    res.render('home')
});

app.listen(5000);