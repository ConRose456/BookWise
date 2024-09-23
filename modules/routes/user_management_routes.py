from flask import request, jsonify, Blueprint
from modules.auth import token_required

import modules.datasource as datasource

user_management_bp = Blueprint('user_management', __name__)

@user_management_bp.route('/api/is_admin', methods=["GET"])
@token_required
def getAdminAuthed(current_user, session, isAuthed):
    if (not isAuthed) or not(current_user.is_admin):
        return jsonify({
            'isAuthed': False, 
            'error': "User does not have the correct auth credentials"
        }), 403
    return jsonify({'isAuthed': True }), 200


@user_management_bp.route('/api/users', methods=["GET"])
@token_required
def getAllUsers(current_user, session, isAuthed):
    if (not isAuthed) or (not current_user.is_admin):
        return jsonify({
            'isAuthed': False, 
            'data': [], 
            'error': "User does not have the correct auth credentials"
        }), 403
    
    try :
        users = session.query(datasource.User).all()
    
        # format user data as json
        user_data = [{
            'username': user.username,
            'first_name': user.first_name,
            'second_name': user.second_name,
            'is_admin': user.is_admin
        } for user in users]

        return jsonify({'isAuthed': True, 'data': user_data}), 200
    except Exception as e:
        return jsonify({'isAuthed': False, 'data': [], 'error': e}), 403
    finally:
        session.close()


