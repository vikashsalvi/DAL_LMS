# Serverless Project
# Author : Yashesh Savani
# Date Created: 24th July, 2020
# Task: Upload file to analyse and get all uploaded'files cluster number.

import os
from flask import Flask, render_template, request, redirect, url_for
from google.cloud import storage

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join(os.getcwd(), "Serverless Project-data processing.json")

app = Flask(__name__)

data_analysis_page_file = os.getenv("DATA_ANALYSIS_FILE")
upload_file_page = os.getenv("UPLOAD_FILE_PAGE")
src_bucket = os.getenv("SRC_BUCKET")


@app.route("/", methods=["GET"])
@app.route("/uploadfile", methods=["GET"])
def upload_file_homepage():
    if request.args.get("msg"):
        msg = request.args.get("msg")
    else:
        msg = "Upload a File"

    return render_template(upload_file_page, msg=msg)


@app.route("/uploadfile", methods=["POST"])
def upload_file_to_cloud_storage():
    # get the file to be uploaded
    upload_file = request.files.get("file")
    client_storage = storage.Client()
    filename_list = []
    cluster_list = []
    # Get object of the bucket where files will be uploaded
    src_bucket_object = client_storage.get_bucket(src_bucket)
    try:
        # Upload file to the bucket userfileanalysis
        src_bucket_blob = src_bucket_object.blob(upload_file.filename)
        src_bucket_blob.upload_from_file(upload_file)
        msg = "File uploaded Successfully!"
    except Exception as e:
        print(e)
        msg = "Error in File uploading! Try again"
        return redirect(url_for(".upload_file_homepage", msg=msg))
    try:
        while True:
            # Get uploaded file and its cluster
            src_file_blob = src_bucket_object.get_blob(upload_file.filename)
            metadata = src_file_blob.metadata
            if metadata is not None:
                for file in src_bucket_object.list_blobs():
                    file_blob_for_cluster = src_bucket_object.get_blob(file.name)
                    filename_list.append(file.name)
                    metadata = file_blob_for_cluster.metadata
                    cluster_list.append(metadata["cluster"])
                break
    except Exception as e:
        print(e)
        msg = "Error in File uploading! Try again"
        return redirect(
            url_for(".upload_file_homepage", msg=msg))

    return render_template(data_analysis_page_file, msg=msg, cluster=cluster_list, filename=filename_list)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
