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
            return jsonify({'isAuthed': False})
        
        try:
            data = jwt.decode(token, key=SECRET_KEY, algorithms=['HS256'])
            current_user = session.query(datasource.User).filter_by(username=data["user_username"]).first()
            session.close()
        except jwt.ExpiredSignatureError:
            return jsonify({'isAuthed': False})
        except jwt.InvalidTokenError:
            return jsonify({'isAuthed': False})
        
        return f(current_user, isAuthed=True, *args, **kwargs)
    return decorated