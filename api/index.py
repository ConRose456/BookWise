from flask import Flask
from modules.routes.login_routes import login_bp
from modules.routes.book_routes import book_bp
from modules.routes.user_management_routes import user_management_bp

app = Flask(__name__)

app.register_blueprint(login_bp)
app.register_blueprint(book_bp)
app.register_blueprint(user_management_bp)

if __name__ == "__main__":
    app.run(port=5328)
