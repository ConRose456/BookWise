from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from modules.auth import token_required
from modules.utils.images import upload_image
import modules.datasource as datasource
import json

book_bp = Blueprint('books', __name__)

# function getting offset and page size for pafinated book request
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

# Get endpoint to get a books in book table
@book_bp.route("/api/all_books", methods=["GET"])
def getAllBooks():
    session = datasource.initDatasource()

    search_query = request.args.get('query', '').strip()

    offset, page_size = paginateBooks(request)

    # filtering by search query
    books_query = session.query(datasource.Book).filter(
        or_(
            datasource.Book.title.ilike(f"%{search_query}%"),
            datasource.Book.author.ilike(f"%{search_query}%")
        )
    )
    
    # getting correct page of paginated books
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

# Get endpoint fro getting all owned books
@book_bp.route("/api/user_books", methods=["GET"])
@token_required
def getUserBooks(current_user, session, isAuthed):
    if not (isAuthed):
        return jsonify({'isAuthed': isAuthed, 'books': json.dumps([])})

    search_query = request.args.get('query', '').strip()
    offset, page_size = paginateBooks(request)

    users_books_ids = session.query(datasource.OwnedBook.isbn).filter(
        datasource.OwnedBook.user_id == current_user.username,
        datasource.OwnedBook.removed == False 
    ).all()

    # filtering by search query
    books_query = session.query(
        datasource.Book
    ).filter(
        datasource.Book.isbn.in_([isbn[0] for isbn in users_books_ids]),
        or_(
            datasource.Book.title.ilike(f"%{search_query}%"),
            datasource.Book.author.ilike(f"%{search_query}%")
        )
    )

    # getting correct page of paginated books
    books = books_query.offset(offset).limit(page_size).all()
    total_books = books_query.count()

    session.close()

    if not books:
        return jsonify({'books': json.dumps([]), 'isAuthed': True, 'error': 'failed_books_fetch'})
    
    pagination = {
        'total_pages': (total_books + page_size - 1) // page_size
    }

    return jsonify({
        'books': json.dumps([book.to_dict() for book in books]),
        'pagination': json.dumps(pagination),
        'isAuthed': True
    })

# Api endpoint to contribute book / add new book to book table
@book_bp.route("/api/contribute_book", methods=["POST"])
@token_required
def contribute_book(current_user, session, isAuthed):
    if not (isAuthed):
        return jsonify({'isAuthed': isAuthed, 'success': False})

    # Upload image and retrieve image url
    public_url = upload_image(request)

    # Check if the book with the given ISBN already exists
    existing_book = session.query(datasource.Book).filter_by(isbn=request.form.get("isbn")).first()

    if existing_book:
        return {"success": False, "message": "Book with this ISBN already exists."}

    # Add the new book
    new_book = datasource.Book(
        isbn=request.form.get("isbn"),
        title=request.form.get("title"),
        author=request.form.get("author"),
        description=request.form.get("description"),
        image_url=public_url
    )

    try:
        session.add(new_book)
        session.commit()
    except Exception as e:
        session.rollback()  # Rollback in case of an error
        return {"success": False, "message": f"Error adding book: {str(e)}"}
    finally:
        print(f"Book Contributed: {current_user} added {json.dumps(new_book.to_dict())}")
        session.close()
        return {"success": True, "message": "Book added successfully."}
    
# Api endpoint to edit book 
@book_bp.route("/api/edit_book", methods=["POST"])
@token_required
def edit_book(current_user, session, isAuthed):
    if not (isAuthed):
        return jsonify({'isAuthed': isAuthed, 'success': False})

    # Upload image and retrieve image url
    public_url = upload_image(request)

    # Get Book to edit
    existing_book = session.query(datasource.Book).filter_by(isbn=request.form.get("isbn")).first()

    if not existing_book:
        return {"success": False, "message": "Book with this ISBN do not exists."}

    # edit the book
    existing_book.title=request.form.get("title"),
    existing_book.author=request.form.get("author"),
    existing_book.description=request.form.get("description"),
    existing_book.image_url=public_url

    try:
        session.add(existing_book)
        session.commit()
    except Exception as e:
        session.rollback()  # Rollback in case of an error
        return {"success": False, "message": f"Error adding book: {str(e)}"}
    finally:
        session.close()
        return {"success": True, "message": "Book added successfully."}

# Api endpoint to add user owned book
@book_bp.route("/api/add_owned_book", methods=["POST"])
@token_required
def add_owned_book(current_user, session, isAuthed):
    if not (isAuthed):
        return jsonify({'isAuthed': isAuthed, 'success': False})
    
    try:
        data = request.json

        existing_owned_book = session.query(datasource.OwnedBook).filter_by(
            user_id=current_user.username,
            isbn=data["title_id"]
        ).first()

        if existing_owned_book:
            if not existing_owned_book.removed:
                return {'success': False, 'message': 'Book already exists in your collection.'}
            else:
                # If the book was removed, we update the 'removed' flag to False
                existing_owned_book.removed = False
                session.commit()
                return {'success': True, 'message': 'Book was previously removed and has been re-added to your collection.'}
        else:
            # If the book does not exist, add it to the owned_books table
            new_owned_book = datasource.OwnedBook(user_id=current_user.username, isbn=data["title_id"])
            session.add(new_owned_book)
            session.commit()
            return {'success': True, 'message': 'Book successfully added to your collection.'}
    except Exception as e:
        session.rollback()
        return {'error': str(e)}, 500
    finally:
        session.close()


# Api endpoint for removing user book 
@book_bp.route("/api/remove_user_book", methods=["POST"])
@token_required
def remove_user_book(current_user, session, isAuthed):
    if not (isAuthed):
        return jsonify({'isAuthed': isAuthed, 'success': False})
    
    try:
        data = request.json
        owned_book = session.query(datasource.OwnedBook).filter_by(user_id=current_user.username, isbn=data["title_id"]).first()
        if not owned_book:
            return jsonify({'isAuthed': isAuthed, 'success': False})
    
        # setting record as removed not deleted so record can be retieved
        owned_book.removed = True
        session.commit()
    except Exception as e:
        session.rollback()  # Rollback in case of an error
        return {'error': str(e)}, 500
    finally:
        session.close()
        return jsonify({'isAuthed': isAuthed, 'success': True})



    



    

    

