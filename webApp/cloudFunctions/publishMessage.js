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


exports.helloWorld = (req, res) => {
  res.set("Access-Control-Allow-Headers", "*")
  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Methods', 'GET, POST')
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
};
