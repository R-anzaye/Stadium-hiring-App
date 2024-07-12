from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, get_jwt
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import timedelta, datetime
import random
from dotenv import load_dotenv
import os

load_dotenv()
postgres_pwd = os.getenv("POSTGRES_PWD")
from models import db, User, Pitch, Booking, Rating

# Initialize Flask app
app = Flask(__name__)

# Configure your database URI here
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://pitches_db_06vs_user:{postgres_pwd}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SECRET_KEY"] = "jdhfvksdjkgh" + str(random.randint(1, 1000000))
app.config["JWT_SECRET_KEY"] = "evrfsejhfgvret" + str(random.randint(1, 1000000))
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

# Initialize extensions
CORS(app)
db.init_app(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

BLACKLIST = set()

@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

@app.route('/')
def index():
    return "Welcome to the Football Pitch Hiring App!"

# User login
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            "access_token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin
            }
        })
    else:
        return jsonify({"error": "Wrong credentials"}), 401

# Fetch current user
@app.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin  
    }
    return jsonify(user_data), 200

# User logout
@app.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"success": "Successfully logged out"}), 200

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()

    email_exists = User.query.filter_by(email=data['email']).first()
    if email_exists:
        return jsonify({"error": "Email already exists"}), 400

    is_admin = data.get('is_admin', False)  # Default to False if not provided

    new_user = User(
        username=data['username'],
        email=data['email'],
        password=bcrypt.generate_password_hash(data['password']).decode('utf-8'),
        is_admin=is_admin
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": "User created successfully"}), 201


# Get user by id (admin)
@app.route('/users/<int:id>', methods=['GET'])
@jwt_required()
def get_user(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
    }), 200

# Update profile (logged in user only)
@app.route('/users', methods=['PUT'])
@jwt_required()
def update_profile():
    data = request.get_json()
    loggedin_user_id = get_jwt_identity()
    user = User.query.get(loggedin_user_id)

    if user is None:
        return jsonify({"message": "User not found"}), 404

    user.username = data.get('username', user.username)
    user.email = user.email  # Email should not be changed in this endpoint
    if 'password' in data:
        user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user.is_admin = data.get('is_admin', user.is_admin)
    db.session.commit()
    return jsonify({"success": "User updated successfully"}), 200

# Delete a user (admin)
@app.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

# Pitch CRUD Operations (admin)
# Create pitch
# Fetch all pitches
@app.route('/get_pitches', methods=['GET'])
@jwt_required()
def get_pitches():
    pitches = Pitch.query.all()

    # Transform pitches to a list of dictionaries for JSON response
    pitches_list = []
    for pitch in pitches:
        pitches_list.append({
            'id': pitch.id,
            'name': pitch.name,
            'description': pitch.description,
            'location': pitch.location,
            'price_per_hour': pitch.price_per_hour
            # Add more fields as needed
        })

    return jsonify({"pitches": pitches_list}), 200

@app.route('/pitches', methods=['POST'])
@jwt_required()
def create_pitch():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.is_admin:
        data = request.get_json()
        new_pitch = Pitch(
            name=data['name'],
            description=data['description'],
            location=data['location'],
            price_per_hour=data['price_per_hour']
        )
        db.session.add(new_pitch)
        db.session.commit()
        return jsonify({"success": "Pitch created successfully"}), 201
    else:
        return jsonify({"error": "You are not authorized to create pitches"}), 401

# Update a pitch
@app.route('/pitches/<int:id>', methods=['PUT'])
@jwt_required()
def update_pitch(id):
    data = request.get_json()
    pitch = Pitch.query.get(id)
    if pitch is None:
        return jsonify({"message": "Pitch not found"}), 404

    pitch.name = data.get('name', pitch.name)
    pitch.description = data.get('description', pitch.description)
    pitch.location = data.get('location', pitch.location)
    pitch.price_per_hour = data.get('price_per_hour', pitch.price_per_hour)
    db.session.commit()
    return jsonify({"message": "Pitch updated successfully"}), 200

# Delete a pitch
@app.route('/pitches/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_pitch(id):
    pitch = Pitch.query.get(id)
    if pitch is None:
        return jsonify({"message": "Pitch not found"}), 404

    db.session.delete(pitch)
    db.session.commit()
    return jsonify({"message": "Pitch deleted successfully"}), 200

# Booking CRUD Operations (user)

@app.route('/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    new_booking = Booking(
        pitch_id=data['pitch_id'],
        user_id=current_user_id,
        date=datetime.strptime(data['date'], '%Y-%m-%dT%H:%M')
    )

    db.session.add(new_booking)
    db.session.commit()

    booking_data = {
        'id': new_booking.id,
        'pitch_id': new_booking.pitch_id,
        'user_id': new_booking.user_id,
        'date': new_booking.date.isoformat(),
    }

    return jsonify(booking_data), 201

@app.route('/get_bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    bookings = Booking.query.all()

    # Transform pitches to a list of dictionaries for JSON response
    bookings_list = []
    for booking in bookings:
        bookings_list.append({
            'id': booking.id,
            'pitch_id': booking.pitch_id,
            'date': booking.date  
        })

    return jsonify({"bookings": bookings_list}), 200


# Update a booking
@app.route('/bookings/<int:booking_id>', methods=['PUT'])
@jwt_required()
def update_booking(booking_id):
    data = request.get_json()
    booking = Booking.query.get_or_404(booking_id)

    booking.pitch_id = data['pitch_id']
    booking.date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M')

    db.session.commit()

    booking_data = {
        'id': booking.id,
        'pitch_id': booking.pitch_id,
        'user_id': booking.user_id,
        'date': booking.date.isoformat(),
    }

    return jsonify(booking_data), 200

# Delete/cancel a booking
@app.route('/bookings/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def delete_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)

    db.session.delete(booking)
    db.session.commit()

    return jsonify({'message': 'Booking deleted successfully'}), 200
# Add a new route to fetch all bookings with pitch and user details (admin only)
@app.route('/admin/bookings', methods=['GET'])
@jwt_required()
def get_admin_bookings():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    bookings = Booking.query.all()

    booking_list = []
    for booking in bookings:
        pitch = Pitch.query.get(booking.pitch_id)
        user = User.query.get(booking.user_id)
        if pitch and user:
            booking_data = {
                'id': booking.id,
                'pitch_name': pitch.name,
                'username': user.username,
                'date': booking.date.isoformat()
            }
            booking_list.append(booking_data)

    return jsonify({"bookings": booking_list}), 200


# Rating CRUD Operations (user)

@app.route('/ratings', methods=['POST'])
@jwt_required()
def create_rating():
    data = request.get_json()

    # Ensure all required fields are present in the request
    required_fields = ['pitch_id', 'rating', 'comment']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing '{field}' field in request"}), 400

    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # Fetch the Pitch object associated with the rating
    pitch_id = data['pitch_id']
    pitch = Pitch.query.get(pitch_id)
    
    if not pitch:
        return jsonify({"error": "Pitch not found"}), 404

    if current_user.is_admin:
        return jsonify({"error": "Admins cannot create ratings"}), 400

    new_rating = Rating(
        pitch_id=pitch.id,
        user_id=current_user_id,
        rating=data['rating'],
        comment=data['comment']
    )

    db.session.add(new_rating)
    db.session.commit()

    # Return the newly created rating in the response
    return jsonify({
        "success": "Rating created successfully",
        "rating": {
            "id": new_rating.id,
            "pitch_id": new_rating.pitch_id,
            "user_id": new_rating.user_id,
            "rating": new_rating.rating,
            "comment": new_rating.comment
        }
    }), 201
@app.route('/ratings/<int:id>', methods=['PUT'])
@jwt_required()
def update_rating(id):
    data = request.get_json()
    rating = Rating.query.get(id)
    if rating is None:
        return jsonify({"message": "Rating not found"}), 404

    rating.pitch_id = data.get('pitch_id', rating.pitch_id)
    rating.user_id = data.get('user_id', rating.user_id)
    rating.rating = data.get('rating', rating.rating)
    rating.comment = data.get('comment', rating.comment)
    db.session.commit()
    return jsonify({"message": "Rating updated successfully"}), 200

# Delete a rating
@app.route('/ratings/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_rating(id):
    rating = Rating.query.get(id)
    if rating is None:
        return jsonify({"message": "Rating not found"}), 404

    db.session.delete(rating)
    db.session.commit()
    return jsonify({"message": "Rating deleted successfully"}), 200

# Get all ratings

@app.route('/ratings_list', methods=['GET'])
@jwt_required()
def get_all_ratings():
    ratings = Rating.query.all()
    if not ratings:
        return jsonify({"message": "No ratings found"}), 404

    rating_list = []
    for rating in ratings:
        pitch = Pitch.query.get(rating.pitch_id)  # Fetch the Pitch associated with the Rating
        if not pitch:
            continue  
        rating_data = {
            'id': rating.id,
            'pitch_id': rating.pitch_id,
            'user_id': rating.user_id,
            'rating': rating.rating,
            'comment': rating.comment,
            'pitch_name': pitch.name            
        }
        rating_list.append(rating_data)

    return jsonify(rating_list), 200

if __name__ == '__main__':
    app.run(debug=True)