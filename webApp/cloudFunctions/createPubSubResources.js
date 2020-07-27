
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

exports.startFun = (req, res) => {
  res.set("Access-Control-Allow-Headers", "*")
  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Methods', 'GET, POST')
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
    res.status(200).send("true")
    });
};
