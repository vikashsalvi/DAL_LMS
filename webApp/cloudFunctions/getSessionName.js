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


exports.getSessionName = (req, res) => {
  res.set("Access-Control-Allow-Headers", "*")
  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Methods', 'GET, POST')
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
};
