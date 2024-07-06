from flask import Flask,request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import random
import datetime
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, get_jwt
from datetime import timedelta
from flask_cors import CORS
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pitches.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SECRET_KEY"] = "jdhfvksdjkgh"+ str(random.randint(1, 1000000))
app.config["JWT_SECRET_KEY"] = "evrfsejhfgvret"+ str(random.randint(1, 1000000))
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
jwt = JWTManager(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import db, User, Pitch, Booking, Rating

from datetime import datetime

@app.route('/')
def index():
    return "Welcome to the Football Pitch Hiring App!"

# User CRUD Operations
# user log in
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token":access_token})

    else:
        return jsonify({"error": "Wrong credentials"}), 401
    
# Fetch Current user
@app.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin  
    }
    return jsonify(user_data), 200
    
# Logout
# check if token is in blacklist
BLACKLIST = set()
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

@app.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"success":"Successfully logged out"}), 200

# create user(user registration)
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    email_exists = User.query.filter_by(email=data['email']).first()
    if email_exists:
        return jsonify({"error": "Email already exists"}), 400
        
    
    new_user = User(
        name=data['name'],
        email=data['email'],
        password= bcrypt.generate_password_hash( data['password'] ).decode('utf-8'),
        is_admin=data.get('is_admin', False)
        
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": "User created successfully"}), 201

#get user by id (admin)
@app.route('/users/<int:id>', methods=['GET'])
@jwt_required()
def get_user(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin,
    }), 200


#Update Profile (logged in user only)
@app.route('/users', methods=['PUT'])
@jwt_required()
def update_profile():
    data = request.get_json()

    loggedin_user_id = get_jwt_identity()
    user = User.query.get(loggedin_user_id)
    if user is None:
        return jsonify({"message": "User not found"}), 404

    user.name = data.get('name', user.name)
    user.email = user.email
    user.password = bcrypt.generate_password_hash( data['password'] ).decode('utf-8') 
    user.is_admin = data.get('is_admin', user.is_admin)
    db.session.commit()
    return jsonify({"success": "User updated successfully"}), 200

# delete a user(admin)
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200



# Pitch CRUD Operations(admin)
# create pitch
@app.route('/pitches', methods=['POST'])
@jwt_required()
def create_pitch():
    current_user_id = get_jwt_identity()

    current_user = User.query.get(current_user_id)

    if current_user.is_admin:
        data = request.get_json()
        new_pitch = Pitch(
            pitch_name=data['pitch_name'],
            description=data['description'],
            location=data['location'],
            price_per_hour=data['price_per_hour'],
            admin_id=current_user_id
        )
        db.session.add(new_pitch)
        db.session.commit()
        return jsonify({"success": "Pitch created successfully"}), 201

    else:
        return jsonify({"error": "You are not authorized to create pitches"}), 401


# update a pitch
@app.route('/pitches/<int:id>', methods=['PUT'])
def update_pitch(id):
    data = request.get_json()
    pitch = Pitch.query.get(id)
    if pitch is None:
        return jsonify({"message": "Pitch not found"}), 404

    pitch.pitch_name = data.get('pitch_name', pitch.pitch_name)
    pitch.description = data.get('description', pitch.description)
    pitch.location = data.get('location', pitch.location)
    pitch.price_per_hour = data.get('price_per_hour', pitch.price_per_hour)
    pitch.admin_id = data.get('admin_id', pitch.admin_id)
    db.session.commit()
    return jsonify({"message": "Pitch updated successfully"}), 200

# delete a pitch
@app.route('/pitches/<int:id>', methods=['DELETE'])
def delete_pitch(id):
    pitch = Pitch.query.get(id)
    if pitch is None:
        return jsonify({"message": "Pitch not found"}), 404

    db.session.delete(pitch)
    db.session.commit()
    return jsonify({"message": "Pitch deleted successfully"}), 200


# Booking CRUD Operations (user)
# create booking
@app.route('/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()

    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.is_admin:
        return jsonify({"error": "Admins cannot do bookings"}), 400

    new_booking = Booking(
        pitch_id=data['event_id'],
        user_id=['current_user_id'],
        booking_date=datetime.strptime(data['booking_date'], '%Y-%m-%d %H:%M:%S')
    )

    db.session.add(new_booking)
    db.session.commit()
    return jsonify({"success": "Booking created successfully"}), 201

# update a booking
@app.route('/bookings/<int:id>', methods=['PUT'])
def update_booking(id):
    data = request.get_json()
    booking = Booking.query.get(id)
    if booking is None:
        return jsonify({"message": "Booking not found"}), 404

    booking.pitch_id = data.get('event_id', booking.pitch_id)
    booking.user_id = data.get('user_id', booking.user_id)
    booking.booking_date = datetime.strptime(data.get('booking_date', booking.booking_date.strftime('%Y-%m-%d %H:%M:%S')), '%Y-%m-%d %H:%M:%S')
    db.session.commit()
    return jsonify({"message": "Booking updated successfully"}), 200

# delete/cancel a booking
@app.route('/bookings/<int:id>', methods=['DELETE'])
def delete_booking(id):
    booking = Booking.query.get(id)
    if booking is None:
        return jsonify({"message": "Booking not found"}), 404

    db.session.delete(booking)
    db.session.commit()
    return jsonify({"message": "Booking deleted successfully"}), 200

# rating crud operations(user)
# add a rating
@app.route('/ratings', methods=['POST'])
@jwt_required()
def create_rating():
    data = request.get_json()

    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.is_admin:
        return jsonify({"error": "Admins cannot do ratings"}), 400

    new_rating = Rating(
        pitch_id=data['pitch_id'],
        user_id=data['current_user_id'],
        rating=data['rating'],
        comment=data['comment']
    )

    db.session.add(new_rating)
    db.session.commit()
    return jsonify({"success": "Rating created successfully"}), 201

# update a rating
@app.route('/ratings/<int:id>', methods=['PUT'])
def update_rating(id):
    data = request.get_json()
    rating = Rating.query.get(id)
    if rating is None:
        return jsonify({"message": "Rating not found"}), 404

    rating.pitch_id = data.get('event_id', rating.pitch_id)
    rating.user_id = data.get('user_id', rating.user_id)
    rating.rating = data.get('rating', rating.rating)
    rating.comment = data.get('comment', rating.comment)
    db.session.commit()
    return jsonify({"message": "Rating updated successfully"}), 200

# delete a rating
@app.route('/ratings/<int:id>', methods=['DELETE'])
def delete_rating(id):
    rating = Rating.query.get(id)
    if rating is None:
        return jsonify({"message": "Rating not found"}), 404

    db.session.delete(rating)
    db.session.commit()
    return jsonify({"message": "Rating deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
