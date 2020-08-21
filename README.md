# CSCI5410_Serverless_Project Group 5

# Developed By:
1. Vikash Salvi 
2. Yashesh Savani
3. Darshan Kathiriya
4. Swetha Subhash


# URL 
https://authentication-module.d30suywhaygpxb.amplifyapp.com/

# Project Details

Project Name: DALServerless Learning Management System
Course Name: CSCI 5410 Serverless Computing

Project Description:

It is a multi-cloud web-based application developed using ReactJs, HTML, Python, Flask, GCP (Google Cloud Platform), and AWS (Amazon Web Services) by following agile development methodology.

The main motto of the application was to try combining different services of GCP and AWS for different modules of application which are given as below:

1) User Management & Authentication Module: AWS Cognito, GCP Firestore, AWS RDS, GCP Cloud Functions
 - In user management module, for first factor authentication the ID & password will be stored on AWS Cognito and AWS RDS. Then for second factor authentication security questions will be saved on GCP Firestore.	

 - While authentication of user will be done using both the cloud's services. 
 
2) Chat/Discussion Module: GCP Pub/Sub Service, GCP cloud storage
 - Using GCP Pub/Sub Service, create a session for the discussion of the user and create subscibers for the users online to join that session. As session terminates the chat will be stored into GCP Cloud Storage.

3) Online Support Module/ChatBot: AWS Lex
 - This module is basically a chatbot created using AWS Lex service which will answer the query's of user regarding the usage of oru web application.

4) Data Processing Module: Flask, Docker, GCP Container Registry, GCP Cloud Run
 - Uploading a file to GCP Cloud Storage, then get the data written in file using python script running on GCP Cloud Run and process the file. Using the processed data, create a wordcloud which shows which words are used more.

5) Machine Learning Analysis 1: GCP AI Platform, GCP Cloud Functions
 - We used GCP AI platform to train our KMeans model on the training data "Reuters-21578, Distribution 1.0" [1]. Then using that trained model, a script running in GCP Cloud Function predicted the clusters of the files uploaded by users.

6) Machine Learning Analysis 2: GCP Cloud Storage, AWS S3, AWS Lambda, Amazon Comprehend
 - In this module, the json files of chat stored in GCP Cloud Storage from the Chat/Discussion module are used. On user request, these files will be sent to AWS S3 bucket using GCP Cloud Function. 
 - Then these files will be read from the bucket and the messages stored in this files will be extracted and will be sent for Sentiment Analysis using Amazon Comprehend. 
 - At last, this chat messages will be tagged with its sentiment and again put in to json files. These new files will be stored in different AWS S3 bucket.

# References 

[1] Machine Learning Analysis 1: Training Dataset
 
Dataset: "Reuters-21578, Distribution 1.0"
Source: https://archive.ics.uci.edu/ml/machine-learning-databases/reuters21578-mld/ 

[2] Machine learning Analysis 1: KMeans model

“K-Means Clustering with scikit-learn,” Jonathan Soma makes things. [Online]. Available: http://jonathansoma.com/lede/algorithms-2017/classes/clustering/k-means-clustering-with-scikit-learn/. [Accessed: 26-Jul-2020].

[3] Machine Learning Analysis 2: stopwords.txt

262588213843476, “NLTK's list of english stopwords,” Gist. [Online]. Available:
https://gist.github.com/sebleier/554280. [Accessed: 25-Jul-2020].

[4] Google PubSub
"Google pub sub", Google. [Online]. Available: https://cloud.google.com/pubsub/docs

[5] Google Cloud Platform functions
"Google cloud function", Google. [Online]. Available https://cloud.google.com/functions

[6] Google Pub Sub demonstration
"Google examples", Google. [Online]. Available https://github.com/googleapis/python-pubsub

[7] ReactJS 
"React framework", React Org. [Online]. Available https://reactjs.org/

[8] Google Cloud functions
"Cloud function example", Google. [Online]. Available https://github.com/firebase/functions-samples
