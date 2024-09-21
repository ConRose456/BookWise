from flask import Flask
from routes.login_routes import login_bp
from routes.book_routes import book_bp

app = Flask(__name__)

app.register_blueprint(login_bp)
app.register_blueprint(book_bp)

if __name__ == "__main__":
    app.run(port=5328)
