# Serverless Project
# Author : Yashesh Savani
# Date Created: 24th July, 2020
# Task: Get json files of Chat from s3 bucket and tag them by using Amazon Comprehend

import boto3
import os
import json

os.environ["SRC_BUCKET"] = "chatjson"
os.environ["DEST_BUCKET"] = "taggedchatsjson"


# Reference: https://docs.aws.amazon.com/comprehend/latest/dg/get-started-api-sentiment.html#get-started-api-sentiment-python
def tag_chat_resources():
    S3_BUCKET = os.getenv("SRC_BUCKET")
    TAGGED_JSON_FILE_BUCKET = os.getenv("DEST_BUCKET")
    s3_client = boto3.client("s3")
    comprehend_client = boto3.client("comprehend")

    for files in s3_client.list_objects_v2(Bucket=S3_BUCKET)["Contents"]:
        file_object = s3_client.get_object(Bucket=S3_BUCKET, Key=files["Key"])
        file_data = json.loads(file_object['Body'].read().decode("utf-8"))
        for users in file_data.keys():
            for messages in file_data[users]:
                msg_for_analysis = messages["message"]
                tagged_json = comprehend_client.detect_sentiment(Text=msg_for_analysis, LanguageCode="en")
                messages["Sentiment"] = tagged_json["Sentiment"]
                messages["SentimentScore"] = tagged_json["SentimentScore"]
        json_chat = json.dumps(file_data).encode("utf-8")
        s3_client.put_object(Bucket=TAGGED_JSON_FILE_BUCKET, Key=files["Key"], Body=json_chat)


if __name__ == "__main__":
    tag_chat_resources()
