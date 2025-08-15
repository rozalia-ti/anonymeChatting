from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

# Конфигурация базы данных
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db', 'messages.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Модель сообщения
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {
            'text': self.text,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }

# Создание таблиц при первом запуске
with app.app_context():
    db.create_all()

# Маршруты
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/messages', methods=['GET'])
def get_messages():
    messages = Message.query.order_by(Message.timestamp.desc()).all()
    return jsonify([msg.to_dict() for msg in messages])

@app.route('/messages', methods=['POST'])
def add_message():
    text = request.form.get('text', '').strip()
    if not text:
        return jsonify({'error': 'Сообщение не может быть пустым'}), 400
    
    new_message = Message(text=text)
    db.session.add(new_message)
    db.session.commit()
    
    return jsonify(new_message.to_dict()), 201

if __name__ == '__main__':
    app.run(debug=True)