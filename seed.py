from app import app, bcrypt
from models import db, User, Pitch, Booking, Rating
from datetime import datetime
import random

def seed_users():
    users = [
        User(username='Wendy', email='wendykariuki@gmail.com', password= bcrypt.generate_password_hash('password1').decode('utf-8'), is_admin=False),
        User(username='Reuben', email='rickreuben@gmail.com', password= bcrypt.generate_password_hash('heyyy').decode('utf-8'), is_admin=False),
        User(username='Ryan', email='ryananzaye@gmail.com', password=bcrypt.generate_password_hash('adminpass1').decode('utf-8'), is_admin=True),
    ]
    for user in users:
     db.session.add(user)
    
    db.session.commit()


def seed_pitches():
    pitches = [
        Pitch(name='Pitch 1', description='Description 1', location='Location 1', price_per_hour=50.0),
        Pitch(name='Pitch 2', description='Description 2', location='Location 2', price_per_hour=70.0),
    ]
    for pitch in pitches :
     db.session.add(pitch)
    
    db.session.commit()

def seed_bookings():
    users = User.query.all()
    pitches = Pitch.query.all()

    bookings = [
        Booking(pitch_id=random.choice(pitches).id, user_id=random.choice(users).id, date=datetime.now()),
        Booking(pitch_id=random.choice(pitches).id, user_id=random.choice(users).id, date=datetime.now()),
    ]
    for booking in bookings:
     db.session.add(booking)

    db.session.commit()

def seed_ratings():
    users = User.query.all()
    pitches = Pitch.query.all()

    ratings = [
        Rating(pitch_id=random.choice(pitches).id, user_id=random.choice(users).id, rating=random.randint(1, 5), comment='Great pitch!'),
        Rating(pitch_id=random.choice(pitches).id, user_id=random.choice(users).id, rating=random.randint(1, 5), comment='Not bad.'),
    ]
    for rating in ratings:
     db.session.add(rating)
    db.session.commit()

def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()
        seed_users()
        seed_pitches()
        seed_bookings()
        seed_ratings()

if __name__ == '__main__':
    seed_data()
