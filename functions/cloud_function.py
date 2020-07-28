from flask import jsonify, make_response
import requests
import logging
import datetime

from google.cloud import firestore

db = firestore.Client("severless-assignments")

logger = logging.getLogger()
logger.setLevel(logging.INFO)

URL = "https://qpy0o2uhn6.execute-api.us-east-1.amazonaws.com/Auth_deploy/sign_up"


def add_question(db, question, answer, user_id):
    doc_ref = db.collection("user_questions").document(user_id)
    doc_ref.set({"question": question, "answer": answer})


def verify_question(db, question, answer, username):
    docs = (
        db.collection("user_questions")
        .where("question", "==", question)
        .where("answer", "==", answer)
        .stream()
    )
    result = any([doc.id == username for doc in docs])
    logger.info(f"Queary Result: {result}")
    return result


def get_question(db, username):
    return db.collection("user_questions").document(username).get().get("question")


def verify_answer(db, username, answer):
    return (
        db.collection("user_questions").document(username).get().get("answer") == answer
    )


def send_response(response):
    response = jsonify(response)
    response.headers.set("Access-Control-Allow-Headers", "*")
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    return response


def lambda_handler(request):
    response = {"status": 0}
    if request.method == "OPTIONS":
        return send_response(response)
    # Get Json
    try:
        request_json = request.get_json()
        logger.info(request_json)
        action = request_json["path"]
        if action == "sign_up":
            user = request_json["user"]
            logger.info("Making request")
            r = requests.post(url=URL, json={"user": user})
            aws_response = r.json()
            logger.info(f"Request data: {aws_response}")
            if aws_response["status"] == 1:
                try:
                    add_question(
                        db,
                        user["question"],
                        user["answer"],
                        user["email"] + "_" + user["organization"],
                    )
                    response["status"] = 1
                except Exception as e:
                    logger.error("Failed to add question")
            else:
                response["error"] = aws_response["error"]
                return send_response(response)
        elif action == "sign_in":
            username = request_json["username"]
            question = request_json["question"]
            answer = request_json["answer"]
            if verify_question(db, question, answer, username) > 0:
                response["status"] = 1
            else:
                response["status"] = 0
        elif action == "get_question":
            username = request_json["username"]
            question = get_question(db, username)
            if question is not None:
                response["status"] = 1
                response["question"] = question
            else:
                response["status"] = 0
        elif action == "verify_answer":
            username = request_json["username"]
            answer = request_json["answer"]
            if verify_answer(db, username, answer):
                response["status"] = 1
            else:
                response["status"] = 0
    except Exception as e:
        logger.error(e)
    return send_response(response)

