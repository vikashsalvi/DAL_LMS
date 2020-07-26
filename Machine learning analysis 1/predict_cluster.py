from google.cloud import storage
from sklearn.feature_extraction.text import CountVectorizer
import pickle
import os
import urllib.request as ur

def hello_gcs(event, context):

    file_bucket_name = event['bucket']
    file_name = event['name']
    file_name_to_process = file_name.split('.')[0]
    print('Bucket: ', file_bucket_name)
    print("File name: ", file_name)
    client = storage.Client()

    # Load feature model
    kmeans_model = pickle.load(ur.urlopen("https://storage.googleapis.com/kmeansmodels/kmeans_model.pkl"))
    vocab = pickle.load(ur.urlopen("https://storage.googleapis.com/kmeansmodels/feature.pkl"))

    # Predict the cluster of given file
    title_word_vector = CountVectorizer(vocabulary=vocab)
    matrix = title_word_vector.transform([file_name_to_process])
    pred = kmeans_model.predict(matrix)

    # Add the predicted cluster number to the metadata of the file
    src_bucket = client.bucket(file_bucket_name)
    src_file_blob = src_bucket.get_blob(file_name)
    src_file_blob.metadata = {"cluster": pred[0]}
    src_file_blob.patch()
