from flask import request, jsonify, Blueprint

import datetime
import modules.datasource as datasource
import jwt
import json
import bcrypt
import os

login_bp = Blueprint('login', __name__)

SECRET_KEY = os.getenv("SECRET_KEY")

# function to hash password before storing
def hash_password(password):
    password_bytes = password.encode('utf-8')
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt())

# function to check entered password against stored hashed password
def check_hashed_password(stored_hash_hex, password):
    password_bytes = password.encode('utf-8')
    stored_hash_bytes = bytes.fromhex(stored_hash_hex.replace("\\x", ""))
    return bcrypt.checkpw(password_bytes, stored_hash_bytes)

# function to login user / retrive JWT
def login_user(username, password, session):
    user = session.query(datasource.User).filter_by(username=username).first()

    if (user and check_hashed_password(user.password, password)):
        payload = {
            "user_username": user.username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            "is_admin": user.is_admin
        }
        token = jwt.encode(payload, key=SECRET_KEY, algorithm='HS256')
        return jsonify({'userText': user.username,'token': json.dumps(token)})
    
    return jsonify({'userText': "", 'token': "", 'errors': 'login_failed'})

# checking if user name exists endpoint for input validation
@login_bp.route("/api/check_username_exists", methods=["POST"])
def check_username_exists():
    session = datasource.initDatasource()
    user = session.query(datasource.User).filter_by(username=request.json["username"]).first()
    session.close()

    if (user):
        return jsonify({'exists': True})
    return jsonify({'exists': False})

# sign up endpoint
@login_bp.route("/api/sign_up", methods=["POST"])
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

# login endpoint
@login_bp.route("/api/login", methods=['POST'])
def login():
    session = datasource.initDatasource()
    result = login_user(request.json["username"], request.json["password"], session)
    session.close()
    return result