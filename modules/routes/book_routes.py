from flask import Blueprint, jsonify, request
import modules.datasource as datasource

import json

book_bp = Blueprint('books', __name__)

@book_bp.route("/api/all_books", methods=["GET"])
def getAllBooks():
    session = datasource.initDatasource()
    books = session.query(datasource.Book).all()

    try:
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 1))
    except ValueError:
        return jsonify({'errors': 'Invalid pagination parameters'})
    
    if page < 1 or page_size < 1:
        return jsonify({'errors': 'Pagination parameters must be positive integers'})
    
    offset = (page - 1) * page_size

    books_query = session.query(datasource.Book).offset(offset).limit(page_size)
    books = books_query.all()

    total_books = session.query(datasource.Book).count()

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