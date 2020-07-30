import json
import boto3
import pymysql
import logging
import botocore.exceptions
import hmac
import hashlib
import base64

logger = logging.getLogger()
logger.setLevel(logging.INFO)

rds_host = ""
name = ""
password = ""
db_name = "db_lms"
port = 3306

USER_POOL_ID = ''
CLIENT_ID = ''
CLIENT_SECRET = ''


def get_secret_hash(username):
    msg = username + CLIENT_ID
    dig = hmac.new(str(CLIENT_SECRET).encode('utf-8'),
                   msg=str(msg).encode('utf-8'), digestmod=hashlib.sha256).digest()
    d2 = base64.b64encode(dig).decode()
    return d2


try:
    connection = pymysql.connect(rds_host, user=name,
                                 passwd=password, db=db_name, port=port, connect_timeout=5)
except pymysql.MySQLError:
    print("Connection Error")


def get_questions():
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM security_questions"
            cursor.execute(sql)
            rows = cursor.fetchall()
            rows = list(map(lambda row: {'id': row[0], 'title': row[1]}, rows))
            logger.info(rows)
            return rows
    except:
        connection.close()


def lambda_handler(event, context):
    logger.info(event)
    body = {'status': 0}
    assert "path" in event, "Error accessing function"
    logger.info(event['path'])
    if event['path'] == "/questions":
        body['status'] = 1
        body['questions'] = get_questions()
    elif event['path'] == '/sign_up':
        request_body = event['body']
        logger.info(request_body)
        user = json.loads(request_body)['user']
        logger.info(user)
        email = user['email']
        organization = user['organization']
        password = user['password']
        name = user['firstName']+' '+user['lastName']

        username = email+"_"+organization
        client = boto3.client('cognito-idp')
        try:
            resp = client.sign_up(ClientId=CLIENT_ID,
                                  SecretHash=get_secret_hash(username),
                                  Username=username,
                                  Password=password,
                                  UserAttributes=[
                                      {'Name': "email", 'Value': email},
                                      {'Name': "custom:custom:organization",
                                          'Value': organization}
                                  ],
                                  ValidationData=[
                                      {'Name': "username", 'Value': username}
                                  ]
                                  )
            client.admin_confirm_sign_up(UserPoolId=USER_POOL_ID,
                                         Username=username)
            try:
                with connection.cursor() as cursor:
                    sql = "INSERT INTO `users` (`email`, `organization`, `name`) " +\
                        "VALUES (%s, %s, %s)"
                    cursor.execute(sql, (email, organization, name))
                    logger.info("User inserted")
                connection.commit()
                body["status"] = 1
            except Exception as e:
                logger.error(e)
                connection.close()

        except client.exceptions.UsernameExistsException as e:
            body['error'] = "User already exists"
        except client.exceptions.InvalidPasswordException as e:
            body['error'] = "Password is not valid"
        except client.exceptions.UserLambdaValidationException as e:
            body['error'] = "Email already exists"
    elif event['path'] == '/sign_in':
        request_body = json.loads(event['body'])
        logger.info(request_body)
        try:
            username = request_body['username']
            password = request_body['password']
            client = boto3.client('cognito-idp')
            secret_hash = get_secret_hash(username)
            signin_resp = client.initiate_auth(ClientId=CLIENT_ID,
                                               AuthFlow='USER_PASSWORD_AUTH',
                                               AuthParameters={
                                                   'USERNAME': username,
                                                   'SECRET_HASH': secret_hash,
                                                   'PASSWORD': password,
                                               })
            logger.info(signin_resp)
            body['status'] = 1
            body['sign_in_response'] = signin_resp
            try:
                with connection.cursor() as cursor:
                    sql = "INSERT INTO `user_state` (`username`, `is_active`) " +\
                        "VALUES (%s, true) ON DUPLICATE KEY UPDATE is_active=true"
                    cursor.execute(sql, (username,))
                    logger.info("User inserted")
                connection.commit()
                body["status"] = 1
            except Exception as e:
                logger.error(e)
                connection.close()
        except client.exceptions.NotAuthorizedException:
            body['error'] = "The username or password is incorrect"
        except client.exceptions.UserNotConfirmedException:
            body['error'] = "User is not confirmed"
        except Exception as e:
            logger.error(e)
    elif event['path'] == '/sign_out':
        request_body = json.loads(event['body'])
        logger.info(request_body)
        username = request_body['username']
        try:
            with connection.cursor() as cursor:
                sql = "UPDATE `user_state` set is_active =false where username=%s"
                cursor.execute(sql, (username,))
                logger.info("Sign Out Successful")
            connection.commit()
            body["status"] = 1
        except Exception as e:
            logger.error(e)
    elif event['path'] == '/get_online_users':
        logger.info("Getting online users")
        try:
            with connection.cursor() as cursor:
                sql = "select u.name, u.email, u.organization from users as u " +\
                    "join user_state s on s.username = concat(u.email, '_', u.organization);"
                cursor.execute(sql)
                rows = cursor.fetchall()
                rows = list(
                    map(lambda row: {'name': row[0], 'email': row[1], 'organization': row[2]}, rows))
                logger.info(rows)
            body["status"] = 1
        except Exception as e:
            logger.error(e)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(body)
    }
