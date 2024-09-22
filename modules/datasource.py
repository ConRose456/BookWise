from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
import os

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    username = Column(String, primary_key=True)
    password = Column(String)

    is_admin = Column(Boolean, default=False)

    first_name = Column(String)
    second_name = Column(String)
    
    owned_books = relationship('OwnedBook', back_populates='user')

class Book(Base):
    __tablename__ = 'books'
    
    id = Column(Integer, primary_key=True)
    title = Column(String)

    author = Column(String)
    description = Column(String)

    image_url = Column(String)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'image_url': self.image_url,
        }

class OwnedBook(Base):
    __tablename__ = 'owned_books'
    
    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey('books.id'))
    user_id = Column(String, ForeignKey('users.username'))
    removed = Column(Boolean, default=False)
    
    user = relationship('User', back_populates='owned_books')
    book = relationship('Book')

    def to_ids(self):
        return self.id

DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)

def initDatasource():
    Session = sessionmaker(bind=engine)
    return Session()