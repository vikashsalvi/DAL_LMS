const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
var con = mysql.createConnection({
    host: "dal-lms.cg7hbe1k6dgc.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "DalLms2020",
    database: "db_lms"
  });

con.connect(function(err) {
	if (err) throw err
});

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
app.use(express.static(__dirname + '/reactApp/build/'));

app.get('/',function(req,res, next){
    res.sendFile(path.join(__dirname + '/reactApp/build/index.html'));
    next();
});

app.get('/createPubSubResources',function (req, res) {
    
    var request = require("request");
    var options = { method: 'GET',
    url: 'https://qpy0o2uhn6.execute-api.us-east-1.amazonaws.com/Auth_deploy/get_online_users',
    headers: 
    {'cache-control': 'no-cache' } 
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    var data = JSON.parse(body)
        for(let val of data.users) {
            createResource(val)
        }
    res.send("true")
    });

})

app.get('/releasePubSubResources',function (req, res) {
    
    var request = require("request");
    var options = { method: 'GET',
    url: 'https://qpy0o2uhn6.execute-api.us-east-1.amazonaws.com/Auth_deploy/get_online_users',
    headers: 
    {'cache-control': 'no-cache' } 
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    var data = JSON.parse(body)
        for(let val of data.users) {
            deleteResource(val)
        }
    res.send("true")
    });

})
function createResource(val){
    var sub_name = val.email.split("@")[0];
    sub_name = sub_name.split('.').join("");
    const data = {"topic_id":"discussion_forums","subscriber_name":sub_name}
    console.log(data)
    var request = require("request");
    
    var options = { method: 'POST',
    url: 'https://us-central1-rapid-rarity-278219.cloudfunctions.net/createSubscribers',
    headers: 
    { 'content-type': 'application/json' },
    body: data,
    json: true
    };
    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    });
    
}
function deleteResource(val){
    var sub_name = val.email.split("@")[0];
    sub_name = sub_name.split('.').join("");
    const data = {"topic_id":"discussion_forums","subscriber_name":sub_name}
    console.log(data)
    var request = require("request");
    
    var options = { method: 'POST',
    url: 'https://us-central1-rapid-rarity-278219.cloudfunctions.net/deleteSubscriber',
    headers: 
    { 'content-type': 'application/json' },
    body: data,
    json: true
    };
    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    });
    
}
app.post('/publishMessage',function (req, res) {
    let bData = JSON.stringify(req.body)
    
    const data = JSON.parse(bData)
    console.log("Publisher -------")
    console.log(data)
    console.log("Publisher -------")
    var request = require("request");
    var options = { method: 'POST',
        url: 'https://us-central1-rapid-rarity-278219.cloudfunctions.net/publisher',
        headers: 
        { 'content-type': 'application/json' },
        body: data,
        json: true 
    };
    var dataToSend;
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    dataToSend = body;
    });
    res.setHeader('Content-Type', 'application/json')
    
    res.send(dataToSend)
})

app.post('/getSubscribermessage',function (req, res){
    let bData = JSON.stringify(req.body)
    
    const data = JSON.parse(bData)

    var request = require("request");
    var options = { method: 'POST',
        url: 'https://us-central1-rapid-rarity-278219.cloudfunctions.net/subscriber',
        headers: 
        { 'content-type': 'application/json' },
        body: data,
        json: true 
    };
        var dataToSend;
        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body)
        dataToSend = body;
        res.setHeader('Content-Type', 'application/json')
        console.log(dataToSend);
        res.send(dataToSend)
    });    
})

app.post('/getPushMessages',function(req,res){
    console.log(req.body)
    res.status(204).send("No content");
})
app.post('/createSession',function (req, res) {
    
    var sql = "INSERT INTO chat_session (session_name,session_start_time) VALUES ('"+req.body.session_name+"','"+req.body.session_start_time+"')";
    con.query(sql, function(err,result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.send(true);
    });
})

app.get('/removeSession',function (req, res) {
    
    var sql = "truncate table chat_session";
    con.query(sql, function(err,result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.send(true);
    });
})

app.post('/getSessionName',function (req, res) {
    
    var sql = "select count(*) from chat_session";
    let count = 0;
    con.query(sql, function(err,result) {
        if (err) throw err;
        count = parseInt(result[0]["count(*)"].toString());
        if(count > 0){
            var sql2 = "select session_name from chat_session limit 1";
            con.query(sql2, function(err2,res2) {
                if (err2) throw err2;
                
                res.send(res2[0]["session_name"])
            });
        }else{
            res.send("-1")
        }
    });
    
    
    
})

app.post('/getSessionTime',function (req, res) {
    
    var sql = "select count(*) from chat_session";
    let count = 0;
    con.query(sql, function(err,result) {
        if (err) throw err;
        count = parseInt(result[0]["count(*)"].toString());
        if(count > 0){
            var sql2 = "select session_start_time from chat_session limit 1";
            con.query(sql2, function(err2,res2) {
                if (err2) throw err2;
                
                res.send(res2[0]["session_start_time"])
            });
        }else{
            res.send("-1")
        }
    });
    
    
    
})

app.listen(process.env.PORT || 5000, function () {
    console.log('Express serve running on port 5000');
});
