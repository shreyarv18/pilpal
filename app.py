from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__, template_folder='template', static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medications.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Medication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    expiry_date = db.Column(db.Date, nullable=False)
    purchase_frequency = db.Column(db.String(20), nullable=False)
    last_purchased_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Medication {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'quantity': self.quantity,
            'expiry_date': self.expiry_date.strftime('%Y-%m-%d'),
            'purchase_frequency': self.purchase_frequency,
            'last_purchased_at': self.last_purchased_at.strftime('%Y-%m-%d %H:%M:%S')
        }


def create_tables():
    db.create_all()


@app.before_request
def before_first_request():
    create_tables()


@app.route('/')
def index():
    medications = Medication.query.all()
    return render_template('index.html', medications=medications)


@app.route('/medications', methods=['GET'])
def get_medications():
    medications = Medication.query.all()
    return jsonify([medication.serialize() for medication in medications])


@app.route('/medications', methods=['POST'])
def add_medication():
    data = request.json
    new_medication = Medication(
        name=data['name'],
        quantity=data['quantity'],
        expiry_date=datetime.strptime(data['expiry_date'], '%Y-%m-%d').date(),
        purchase_frequency=data['purchase_frequency']
    )
    db.session.add(new_medication)
    db.session.commit()
    return jsonify({"message": "Medication added successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)
