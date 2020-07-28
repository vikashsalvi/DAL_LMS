import requests


def test_existing_sign_up():
    data = {
        "path": "sign_up",
        "user": {
                "firstName": "Dahs",
                "lastName": "DK",
                "username": "dash2508",
                "email": "ds@ds.com",
                "password": "password",
                "organization": "DAL",
                "question": 1,
                "answer": "Desai"
        }
    }
    r = requests.post(
        "https://us-central1-severless-assignments.cloudfunctions.net/mediator-function", json=data)
    response = r.json()
    assert response["status"] == 0, "Test Existing Sign up Failed"


def test_signin():
    data = {
        "username": "ds@ds.com_DAL",
        "password": "password"
    }
    r = requests.post(
        "https://qpy0o2uhn6.execute-api.us-east-1.amazonaws.com/Auth_deploy/sign_in", json=data)
    response = r.json()

    assert response["status"] == 1, "Test sign in with credentials failed."

    data = {
        "path": "verify_answer",
        "username": "ds@ds.com_DAL",
        "answer": "Desai"
    }
    r = requests.post(
        "https://us-central1-severless-assignments.cloudfunctions.net/mediator-function", json=data)
    response = r.json()

    assert response["status"] == 1, "Test sign in answer verification failed."


if __name__ == "__main__":
    test_existing_sign_up()
    test_signin()
    print("Finished Testing")
