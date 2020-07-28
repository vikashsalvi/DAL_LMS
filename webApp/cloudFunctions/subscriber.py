from flask import escape
from concurrent.futures import TimeoutError
import time
from google.cloud import pubsub_v1
from flask import jsonify 


topic_id = "discussion_forums"
project_id = "rapid-rarity-278219"
timeout = 5.0
futures = dict()


def callback_for_subscriber(message):
    messageList.append(message.data.decode("utf-8"))
    print("Received message: {}".format(message.data))
    if message.attributes:
        print("Attributes:")
        for key in message.attributes:
            value = message.attributes.get(key)
            print("{}: {}".format(key, value))
    message.ack()

def listen_to_topic(topic_id,subscriber_name):
    subscriber = pubsub_v1.SubscriberClient()
    subscription_path = subscriber.subscription_path(project_id, subscriber_name)
    streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback_for_subscriber)
    print("Listening for messages on {}..\n".format(subscription_path))
    
    with subscriber:
        try:
            streaming_pull_future.result(timeout=timeout)
        except TimeoutError:
            streaming_pull_future.cancel()

def send_response(response):
    response = jsonify(response)
    response.headers.set("Access-Control-Allow-Headers", "*")
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    return response

def subscriber_listen(request):
    print(request)
    response = {"status": 0}
    if request.method == "OPTIONS":
        return send_response(response)

    global messageList
    messageList = []
    request_json = request.get_json()
    print(request_json)
    project_id = "rapid-rarity-278219"
    topic_id = request_json['topic_id']
    print(topic_id)
    subscriber_name = request_json['subscriber_name']
    listen_to_topic(topic_id,subscriber_name)
    messageListTmp = messageList
    messageList = []
    responses = {"data": messageListTmp}
    return send_response(responses)
    