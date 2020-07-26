# Serverless Project
# Author : Yashesh Savani
# Date Created: 19th July, 2020
# Reference: Assignment 3 (Named Entity Extraction) (Author: Yashesh Savani)
# Task: Extract named entities from uploaded files and create a wordcloud.

import os
import re
from flask import Flask, render_template, request, redirect, url_for
from wordcloud import WordCloud
from google.cloud import storage

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(os.getcwd(), "Serverless Project-data processing.json")

app = Flask(__name__)

data_process_page_file = os.getenv("DATA_PROCESS_FILE")
word_cloud_show_file = os.getenv("WORD_CLOUD_FILE")
upload_file_page = os.getenv("UPLOAD_FILE_PAGE")
src_bucket = os.getenv("SRC_BUCKET")
dest_bucket = os.getenv("DEST_BUCKET")


@app.route("/", methods=["GET"])
@app.route("/uploadFiles", methods=["GET"])
def upload_file_homepage():
    if request.args.get("msg"):
        msg = request.args.get("msg")
    else:
        msg = "Upload File (single or Multiple)"

    return render_template(upload_file_page, msg=msg)


@app.route("/uploadFiles", methods=["POST"])
def upload_file_to_cloud_storage():
    # get the list of files to be uploaded
    upload_files_list = request.files.getlist("file")
    client_storage = storage.Client()

    # Get object of the bucket where files will be uploaded
    src_bucket_object = client_storage.get_bucket(src_bucket)
    try:
        # Upload files one by one to the bucket studentfiles
        for file in upload_files_list:
            src_bucket_blob = src_bucket_object.blob(file.filename)
            src_bucket_blob.upload_from_file(file)
        msg = "Files uploaded Successfully!"
    except Exception as e:
        print(e)
        msg = "Error in File uploading! Try again"
        return redirect(url_for(".upload_file_homepage", msg=msg))

    return render_template(data_process_page_file, msg=msg)


@app.route("/extractEntities", methods=["POST"])
def extract_named_entities():
    named_entities = {}
    word_cloud_image_path = os.path.join(os.getcwd(), "static")
    word_cloud_image_name = "word_cloud.png"
    entities = ""
    client_storage = storage.Client()
    file_blobs = client_storage.list_blobs(src_bucket)

    # Get source bucket object
    src_bucket_object = client_storage.get_bucket(src_bucket)
    # Get destination bucket object
    dest_bucket_object = client_storage.get_bucket(dest_bucket)

    # Reference: https://gist.github.com/sebleier/554280
    with open("stopwords.txt", "r") as f:
        stopwords = [word.strip() for word in f.readlines()]

    # Loop through all the file objects got from GCP storage
    for files in file_blobs:
        src_bucket_blob = src_bucket_object.get_blob(files.name)
        file_data = src_bucket_blob.download_as_string().decode("utf-8")
        file_data = re.sub("[\t-()\n.,\"'\\/]", " ", file_data).split()

        # Check if the word is a namedEntity and not a stopword
        for word in file_data:
            if word.lower() not in stopwords and word[0].isupper():
                if word in named_entities.keys():
                    named_entities[str(word)] += 1
                else:
                    named_entities[str(word)] = 1
                entities += word + " "

    if not os.path.exists(word_cloud_image_path):
        os.mkdir(word_cloud_image_path)

    # Create Word cloud from the entities and save to img folder
    cloud = WordCloud(background_color="white", height=700, width=1000).generate(entities)
    cloud.to_file(os.path.join(word_cloud_image_path, word_cloud_image_name))
    dest_bucket_blob = dest_bucket_object.blob(word_cloud_image_name)

    # Upload file to GCP storage named word_cloud.png
    dest_bucket_blob.upload_from_filename(os.path.join(word_cloud_image_path, word_cloud_image_name))

    # Get the URL of the generated image from the bucket namedentity
    url = "/".join(["https://storage.cloud.google.com", dest_bucket, word_cloud_image_name])
    return render_template(word_cloud_show_file, URL=url)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
