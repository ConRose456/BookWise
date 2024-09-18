import datetime
from flask import Flask, request, jsonify
from functools import wraps

import datasource
import jwt
import json

import sqlalchemy as db

app = Flask(__name__)

session = datasource.initDatasource()
app.config['SECRET_KEY'] = 'your_secret_key'

def login_user(username, password):
    user = session.query(datasource.User).filter_by(username=username).first()

    if (user and user.password == password):
        payload = {
            "user_username": user.username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }
        token = jwt.encode(payload, key=app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'username': user.username,'token': json.dumps(token)})
    return jsonify({})

@app.route("/api/sign_up", methods=["POST"])
def sign_up():
    data = request.json
    print(data)
    new_user = datasource.User(
        username=data["username"], 
        first_name=data["first_name"], 
        second_name=data["second_name"],
        password=data["password"],
        is_admin=data["is_admin"]
    )
    session.add(new_user)
    session.commit()

    return login_user(data["username"], data["password"])

@app.route("/api/login", methods=['POST'])
def login():
    return login_user(request.json["username"], request.json["password"])
