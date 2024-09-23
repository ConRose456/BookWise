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

@user_management_bp.route('/api/delete_user', methods=["POST"])
@token_required
def deleteUser(current_user, session, isAuthed):
    if not isAuthed or not current_user.is_admin:  # Check if user is authenticated and an admin
        return jsonify({'isAuthed': isAuthed, 'success': False }), 403
    
    try:
        # Get the username from the request body
        data = request.json
        user_to_delete = data.get('username')
        
        # Query the user to delete
        user_to_delete = session.query(datasource.User).filter_by(username=user_to_delete).first()

        if not user_to_delete:
            return jsonify({'success': False, 'isAuthed': True, 'error': "User does not exist" }), 404
        
        # Delete the user
        session.delete(user_to_delete)
        session.commit()
        
        return jsonify({'success': True, 'isAuthed': True})
    except Exception as e:
        session.rollback()  # Rollback in case of an error
        return jsonify({'success': False, 'error': str(e)})
    finally:
        session.close()
