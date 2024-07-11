from app import app, bcrypt
from models import db, User, Pitch, Booking, Rating
from datetime import datetime
import random

def seed_users():
    users = [
        User(username='Wendy', email='wendykariuki@gmail.com', password=bcrypt.generate_password_hash('password1').decode('utf-8'), is_admin=False),
        User(username='Reuben', email='rickreuben@gmail.com', password=bcrypt.generate_password_hash('heyyy').decode('utf-8'), is_admin=False),
        User(username='Ryan', email='ryananzaye@gmail.com', password=bcrypt.generate_password_hash('adminpass1').decode('utf-8'), is_admin=True),
    ]
    db.session.add_all(users)
    db.session.commit()

def seed_pitches():
    pitches = [
        Pitch(
            name='Camp Nou',
            description='Home stadium of FC Barcelona.',
            location='Barcelona, Spain',
            price_per_hour=200.0
           
        ),
        Pitch(
            name='Old Trafford',
            description='Home stadium of Manchester United.',
            location='Manchester, England',
            price_per_hour=250.0
        ),
        Pitch(
            name='Santiago Bernabéu',
            description='Home stadium of Real Madrid.',
            location='Madrid, Spain',
            price_per_hour=220.0
            
        ),
        Pitch(
            name='Allianz Arena',
            description='Home stadium of Bayern Munich.',
            location='Munich, Germany',
            price_per_hour=230.0
           
        ),
        Pitch(
            name='San Siro',
            description='Home stadium of AC Milan and Inter Milan.',
            location='Milan, Italy',
            price_per_hour=210.0
        ),
    ]
    db.session.add_all(pitches)
    db.session.commit()

def seed_bookings():
    users = User.query.all()
    pitches = Pitch.query.all()

    bookings = [
        Booking(pitch_id=random.choice(pitches).id, user_id=random.choice(users).id, date=datetime.now()),
        Booking(pitch_id=random.choice(pitches).id, user_id=random.choice(users).id, date=datetime.now()),
    ]
    db.session.add_all(bookings)
    db.session.commit()

def seed_ratings():
    users = User.query.all()
    pitches = Pitch.query.all()

    ratings = [
        Rating(pitch_id=random.choice(pitches).id, user_id=random.choice(users).id, rating=random.randint(1, 5), comment='Great pitch!'),
        Rating(pitch_id=random.choice(pitches).id, user_id=random.choice(users).id, rating=random.randint(1, 5), comment='Not bad.'),
    ]
    db.session.add_all(ratings)
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
