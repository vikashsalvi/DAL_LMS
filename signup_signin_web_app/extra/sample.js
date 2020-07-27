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

exports.createSession = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.set("Access-Control-Allow-Headers", "*")
    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Methods", "GET", "POST")
    res.status(204).send('');
} else {
    var sql = "INSERT INTO chat_session (session_name,session_start_time) VALUES ('"+ req.body.session_name +"','"+ req.body.session_start_time +"')";
      con.query(sql, function(err,result) {
          if (err) throw err;
          console.log("1 record inserted");
          res.send(true);
      });
  }
    
};