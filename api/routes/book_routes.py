from flask import Blueprint, jsonify
from modules import datasource

import json

book_bp = Blueprint('books', __name__)

@book_bp.route("/api/all_books", methods=["GET"])
def getAllBooks():
    session = datasource.initDatasource()
    books = session.query(datasource.Book).all()
    session.close()

    if not (books):
        return jsonify({'books': None, 'errors': 'failed_books_fetch'})
    return jsonify({'books': json.dumps([book.to_dict() for book in books])})