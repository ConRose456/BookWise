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
def getUserBooks(current_user, isAuthed):
    if not (isAuthed):
        return jsonify({'isAuthed': isAuthed, 'books': json.dumps([])})
    
    session = datasource.initDatasource()

    search_query = request.args.get('query', '').strip()
    offset, page_size = paginateBooks(request)

    owned_books_query = session.query(datasource.OwnedBook).filter(
            datasource.OwnedBook.user_id == current_user.username,
            or_(
                datasource.Book.title.ilike(f"%{search_query}%"),
                datasource.Book.author.ilike(f"%{search_query}%")
            )
     ).join(datasource.Book)
    
    books = owned_books_query.offset(offset).limit(page_size).all()
    total_books = owned_books_query.count()

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


    

    

