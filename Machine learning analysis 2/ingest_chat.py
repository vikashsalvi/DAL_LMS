# Serverless Project
# Author : Yashesh Savani
# Date Created: 24th July, 2020
# Task: Ingest chat json files from google cloud storage to s3 bucket

from google.cloud import storage
import boto3
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(os.getcwd(), "Serverless Project-data processing.json")

def ingest_chat_files():

    GCP_BUCKET = os.getenv("GCP_BUCKET")
    S3_BUCKET = os.getenv("S3_BUCKET")
    # Create object of cloud storage client and get blob object of file
    client_storage = storage.Client()
    file_blobs_list = client_storage.list_blobs(GCP_BUCKET)
    src_bucket_object = client_storage.bucket(GCP_BUCKET)

    s3_client = boto3.client("s3")

    # Loop through all the file objects got from GCP storage
    for jsonfile in file_blobs_list:
        src_bucket_blob = src_bucket_object.get_blob(jsonfile.name)
        file_data = src_bucket_blob.download_as_string()
        s3_client.put_object(Bucket=S3_BUCKET, Key=jsonfile.name, Body=file_data)


if __name__ == "__main__":
    ingest_chat_files()

from google.cloud import storage
import boto3
import os


def hello_world(request):
    GCP_BUCKET = os.getenv("GCP_BUCKET")
    S3_BUCKET = os.getenv("S3_BUCKET")
    # Create object of cloud storage client and get blob object of file
    client_storage = storage.Client()
    file_blobs_list = client_storage.list_blobs(GCP_BUCKET)
    src_bucket_object = client_storage.bucket(GCP_BUCKET)
    print("GCP CONNECTED")
    # create client of S3
    s3_client = boto3.client("s3", aws_access_key_id=os.getenv("aws_access_key_id"),
                             aws_secret_access_key=os.getenv("aws_secret_access_key"),
                             aws_session_token=os.getenv("aws_session_token"))
    print("Donnnnnne")
    # Loop through all the file objects got from GCP storage
    for jsonfile in file_blobs_list:
        src_bucket_blob = src_bucket_object.get_blob(jsonfile.name)
        file_data = src_bucket_blob.download_as_string()

        # Create files in S3 bucket
        s3_client.put_object(Bucket=S3_BUCKET, Key=jsonfile.name, Body=file_data)

    return {"Chat files tagged", 200}