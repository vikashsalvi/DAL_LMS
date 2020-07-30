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

exports.removeResources = (req, res) => {
    res.header('Content-Type','application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    //respond to CORS preflight requests
    if (req.method == 'OPTIONS') {
        res.status(204).send('');
    }
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
    res.status(200).send("true")
    });
};
