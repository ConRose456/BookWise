from flask import request, jsonify
from functools import wraps
from modules import datasource

import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        session = datasource.initDatasource()
        auth_header = request.headers.get('Authorization', None)
        token = auth_header.split()[1].strip('"')
        
        if not token:
            return jsonify({'isAuthed': False}), 403
        
        try:
            data = jwt.decode(token, key=SECRET_KEY, algorithms=['HS256'])
            current_user = session.query(datasource.User).filter_by(username=data["user_username"]).first()
        except jwt.ExpiredSignatureError:
            return jsonify({'isAuthed': False}), 403
        except jwt.InvalidTokenError:
            return jsonify({'isAuthed': False}), 403
        
        return f(current_user, session, isAuthed=True, *args, **kwargs)
    return decorated