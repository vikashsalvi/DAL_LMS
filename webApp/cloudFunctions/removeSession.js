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

exports.removeSession = (req, res) => {
  res.set("Access-Control-Allow-Headers", "*")
  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Methods', 'GET, POST')
  var sql = "truncate table chat_session";
    con.query(sql, function(err,result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.status(200).send(true);
    });
};
