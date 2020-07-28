from flask import escape
from flask import jsonify, make_response
from concurrent.futures import TimeoutError
import time
from google.cloud import pubsub_v1
from google.cloud import storage
import json

def deleteSubscriber(subscription_id,project_id):
    subscriber = pubsub_v1.SubscriberClient()
    subscription_path = subscriber.subscription_path(project_id, subscription_id)
    with subscriber:
        subscriber.delete_subscription(subscription_path)

    print("Subscription deleted: {}".format(subscription_path))

def send_response(response):
    response = jsonify(response)
    response.headers.set("Access-Control-Allow-Headers", "*")
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    return response
    
def delete_subscribers(request):
    response = {"status": 0}
    if request.method == "OPTIONS":
        return send_response(response)
    request_json = request.get_json()
    project_id = "rapid-rarity-278219"
    topic_id = request_json['topic_id']
    subscriber_name = request_json['subscriber_name']
    deleteSubscriber(subscriber_name,project_id)
    return {"data":"True"}