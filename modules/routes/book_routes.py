from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from modules.auth import token_required

import modules.datasource as datasource
import json

book_bp = Blueprint('books', __name__)

def paginateBooks(request):
    try:
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 21))
    except ValueError:
        return jsonify({'errors': 'Invalid pagination parameters'})
    
    if page < 1 or page_size < 1:
        return jsonify({'errors': 'Pagination parameters must be positive integers'})
    
    offset = (page - 1) * page_size

    return offset, page_size

@book_bp.route("/api/all_books", methods=["GET"])
def getAllBooks():
    session = datasource.initDatasource()

    search_query = request.args.get('query', '').strip()

    offset, page_size = paginateBooks(request)

    books_query = session.query(datasource.Book).filter(
        or_(
            datasource.Book.title.ilike(f"%{search_query}%"),
            datasource.Book.author.ilike(f"%{search_query}%")
        )
    )
    
    books = books_query.offset(offset).limit(page_size).all()
    total_books = books_query.count()

    session.close()

    if not books:
        return jsonify({'books': None, 'errors': 'failed_books_fetch'})
    
    pagination = {
        'total_pages': (total_books + page_size - 1) // page_size
    }

    return jsonify({
        'books': json.dumps([book.to_dict() for book in books]),
        'pagination': json.dumps(pagination)
    })

@book_bp.route("/api/user_books", methods=["GET"])
@token_required
def getUserBooks(current_user, session, isAuthed):
    if not (isAuthed):
        return jsonify({'isAuthed': isAuthed, 'books': json.dumps([])})

    search_query = request.args.get('query', '').strip()
    offset, page_size = paginateBooks(request)

    users_books_ids = session.query(datasource.OwnedBook.book_id).filter(
        datasource.OwnedBook.user_id == current_user.username,
        datasource.OwnedBook.removed == False 
    ).all()

    books_query = session.query(
        datasource.Book
    ).filter(
        datasource.Book.id.in_([id[0] for id in users_books_ids]),
        or_(
            datasource.Book.title.ilike(f"%{search_query}%"),
            datasource.Book.author.ilike(f"%{search_query}%")
        )
    )

    books = books_query.offset(offset).limit(page_size).all()
    total_books = books_query.count()

    session.close()

    if not books:
        return jsonify({'books': json.dumps([]), 'isAuthed': True, 'errors': 'failed_books_fetch'})
    
    pagination = {
        'total_pages': (total_books + page_size - 1) // page_size
    }

    return jsonify({
        'books': json.dumps([book.to_dict() for book in books]),
        'pagination': json.dumps(pagination),
        'isAuthed': True
    })

@book_bp.route("/api/remove_user_book", methods=["POST"])
@token_required
def remove_user_book(current_user, session, isAuthed):
    if not (isAuthed):
        return jsonify({'isAuthed': isAuthed, 'success': False})
    
    try:
        data = request.json
        owned_book = session.query(datasource.OwnedBook).filter_by(user_id=current_user.username, book_id=data["title_id"]).first()
    
        if not owned_book:
            return jsonify({'isAuthed': isAuthed, 'success': False})
    
        owned_book.removed = True
        session.commit()
    except Exception as e:
        session.rollback()  # Rollback in case of an error
        return {'error': str(e)}, 500
    finally:
        session.close()
        return jsonify({'isAuthed': isAuthed, 'success': True})



    



    

    

