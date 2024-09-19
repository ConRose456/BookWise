from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
import os

Base = declarative_base()

rented_books_table = Table('rented_books', Base.metadata,
    Column('user_username', String, ForeignKey('users.username')),
    Column('book_id', Integer, ForeignKey('books.id'))
)

collection_books_table = Table('collection_books', Base.metadata,
    Column('collection_id', Integer, ForeignKey('collections.id')),
    Column('book_id', Integer, ForeignKey('books.id'))
)

class User(Base):
    __tablename__ = 'users'
    
    username = Column(String, primary_key=True)
    password = Column(String)

    is_admin = Column(Boolean)

    first_name = Column(String)
    second_name = Column(String)
    
    owned_books = relationship('OwnedBook', back_populates='user')
    
    rented_books = relationship('Book', secondary=rented_books_table, back_populates='renters')
    collections = relationship('Collection', back_populates='user')

class Book(Base):
    __tablename__ = 'books'
    
    id = Column(Integer, primary_key=True)
    title = Column(String)
    
    renters = relationship('User', secondary=rented_books_table, back_populates='rented_books')
    collections = relationship('Collection', secondary=collection_books_table, back_populates='books')

class OwnedBook(Base):
    __tablename__ = 'owned_books'
    
    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey('books.id'))
    user_id = Column(String, ForeignKey('users.username'))
    
    user = relationship('User', back_populates='owned_books')
    book = relationship('Book')

class Collection(Base):
    __tablename__ = 'collections'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    user_id = Column(String, ForeignKey('users.username'))
    
    user = relationship('User', back_populates='collections')
    books = relationship('Book', secondary=collection_books_table, back_populates='collections')

DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)

def initDatasource():
    Session = sessionmaker(bind=engine)
    return Session()