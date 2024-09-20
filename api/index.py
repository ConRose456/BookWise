from flask import Flask, request, jsonify
from functools import wraps

import datetime
import modules.datasource as datasource
import jwt
import json
import sqlalchemy as db
import bcrypt

app = Flask(__name__)

app.config['SECRET_KEY'] = 'your_secret_key'

def hash_password(password):
    password_bytes = password.encode('utf-8')
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt())

def check_hashed_password(stored_hash_hex, password):
    password_bytes = password.encode('utf-8')
    stored_hash_bytes = bytes.fromhex(stored_hash_hex.replace("\\x", ""))
    return bcrypt.checkpw(password_bytes, stored_hash_bytes)

def login_user(username, password, session):
    user = session.query(datasource.User).filter_by(username=username).first()

    if (user and check_hashed_password(user.password, password)):
        payload = {
            "user_username": user.username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }
        token = jwt.encode(payload, key=app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'userText': user.username,'token': json.dumps(token)})
    
    return jsonify({'userText': "", 'token': "", 'errors': 'login_failed'})

@app.route("/api/sign_up", methods=["POST"])
def sign_up():
    session = datasource.initDatasource()
    data = request.json

    new_user = datasource.User(
        username=data["username"], 
        first_name=data["first_name"], 
        second_name=data["second_name"],
        password=hash_password(data["password"]),
        is_admin=False
    )
    session.add(new_user)
    session.commit()

    result = login_user(data["username"], data["password"], session)
    session.close()
    return result

@app.route("/api/login", methods=['POST'])
def login():
    session = datasource.initDatasource()
    result = login_user(request.json["username"], request.json["password"], session)
    session.close()
    return result
