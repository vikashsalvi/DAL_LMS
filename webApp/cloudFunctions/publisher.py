from flask import escape
from concurrent.futures import TimeoutError
import time
from google.cloud import pubsub_v1
from google.cloud import storage
import json

topic_id = "discussion_forums"
project_id = "rapid-rarity-278219"
timeout = 5.0
futures = dict()

def pull_callback(f, data):
    def callback(f):
        try:
            print(f.result())
            futures.pop(data)
        except:  # noqa
            print("Please handle {} for {}.".format(f.exception(), data))
    return callback

    
def send_message(data):
    publisher = pubsub_v1.PublisherClient()
    topic_path = publisher.topic_path(project_id, topic_id)
    futures.update({data: None})
    future = publisher.publish(
        topic_path, data=data.encode("utf-8") 
    )
    futures[data] = future
    future.add_done_callback(pull_callback(future, data))
    while futures:
        time.sleep(5)


def upload_blob(bucket_name, source_file_name, destination_blob_name):

    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_file(source_file_name)

def read_file(session_file_name):
    client = storage.Client()
    bucket = client.get_bucket('user-discussion-chat')
    blob = bucket.get_blob(session_file_name)
    downloaded_blob = blob.download_as_string()
    downloaded_blob = downloaded_blob.decode("utf-8") 
    return downloaded_blob

def check_if_file_exist(session_file_name):
    name = session_file_name 
    storage_client = storage.Client()
    bucket_name = 'user-discussion-chat'    
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(name)
    return blob.exists()


def publisher_request(request):
    request_json = request.get_json()
    
    if request_json and 'message' in request_json:
        message = request_json['message']
        session_file_name = request_json['session_name']
        session_file_name = session_file_name + ".json"
        send_message(message)
        if(check_if_file_exist(session_file_name)):
            print('file exist')
            msg = read_file(session_file_name)
            js = json.loads(msg)
            user = message.split("~~")[0]
            if(user in js):
                js[user].append({"message":message.split("~~")[1]})
                print(js)
            else:
                js[user] = [{"message":message.split("~~")[1]}]
            msg = json.dumps(js)
            with open('/tmp/test.txt', "w") as text: 
                text.write(msg) 
            with open('/tmp/test.txt', 'r') as file_obj:
                upload_blob('user-discussion-chat', file_obj, session_file_name)
        else:
            message.split("~~")[0]
            js = {}
            js[message.split("~~")[0]] = [{"message":message.split("~~")[1]}]
            message = json.dumps(js)
            print('file does not exist')
            with open('/tmp/test.txt', "w") as text: 
                text.write(message) 
            with open('/tmp/test.txt', 'r') as file_obj:
                upload_blob('user-discussion-chat', file_obj, session_file_name)
        
    return 'Hello {}!'.format(escape(message))