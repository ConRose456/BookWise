import pytest
from unittest.mock import patch, MagicMock
from modules.datasource import Book, OwnedBook
from modules.auth import token_required
import json

mock_user = MagicMock(username="testuser")

headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcl91c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.c4TbdiFpgr5GH-NowI0nPvazGupA6M1rlmNfRfeaPrY'
}

@pytest.fixture
def app():
    from api.index import app
    app = app
    app.config['TESTING'] = True
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def mock_session():
    # Mock SQLAlchemy session
    with patch('modules.datasource.initDatasource') as mock_session:
        yield mock_session

@pytest.fixture
def mock_supabase():
    with patch('supabase.create_client') as mock_supabase:
        yield mock_supabase

# Testing logic for /api/all_books
def test_get_all_books(client, mock_session):
    mock_session.return_value.query().filter().offset().limit().all.return_value = [
        Book(isbn="123", title="Test Book", author="Author Test")
    ]
    mock_session.return_value.query().filter().count.return_value = 1

    response = client.get('/api/all_books?page=1&page_size=2&query=test')

    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['books'] is not None
    assert len(json.loads(data['books'])) == 1
    assert json.loads(data['books'])[0]['title'] == "Test Book"

# Testing logic for /api/user_books
@patch('modules.auth.token_required', return_value=(mock_user, True, True))
def test_get_user_books(token_required, client, mock_session):
    mock_session.return_value.query().filter().all.return_value = [("123",)]
    mock_session.return_value.query().filter().offset().limit().all.return_value = [
        Book(isbn="123", title="User Book", author="User Author")
    ]
    mock_session.return_value.query().filter().count.return_value = 1

    response = client.get('/api/user_books?page=1&page_size=2&query=test', headers=headers)

    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['books'] is not None
    assert len(json.loads(data['books'])) == 1
    assert json.loads(data['books'])[0]['title'] == "User Book"

### Testing logic for /api/remove_user_book
@patch('modules.auth.token_required', return_value=(mock_user, True, True))
def test_remove_user_book(token_required, client, mock_session):
    mock_session.return_value.query().filter_by().first.return_value = OwnedBook(isbn="123", user_id="testuser")

    data = {
        "title_id": "123",
    }
    response = client.post('/api/remove_user_book', json=data, headers=headers)

    assert response.status_code == 200
    assert json.loads(response.data)['success'] is True