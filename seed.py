from faker import Faker
from app import db, app, bcrypt
from models import User, Pitch, Rating, Booking
import random
from datetime import datetime

fake = Faker()

print("Start seeding ....")
def seed_data():
    with app.app_context():
        db.drop_all()
        # db.create_all()
   
        password =  bcrypt.generate_password_hash('kkkk').decode('utf-8')

def seed_users(n=10):
    for _ in range(n):
        user = User(
            username=fake.user_name(),
            email=fake.email(),
            password=fake.password()
        )
        db.session.add(user)
    db.session.commit()

def seed_pitches(n=10):
    for _ in range(n):
        pitch = Pitch(
            name=fake.company(),
            description=fake.text(),
            location=fake.address(),
            price_per_hour=round(random.uniform(50, 200), 2)
        )
        db.session.add(pitch)
    db.session.commit()

def seed_bookings(n=10):
    users = User.query.all()
    pitches = Pitch.query.all()
    for _ in range(n):
        booking = Booking.insert().values(
            user_id=random.choice(users).id,
            pitch_id=random.choice(pitches).id,
            date=fake.date_time_this_year()
        )
        db.session.execute(booking)
    db.session.commit()

def seed_ratings(n=10):
    users = User.query.all()
    pitches = Pitch.query.all()
    for _ in range(n):
        rating = Rating(
            user_id=random.choice(users).id,
            pitch_id=random.choice(pitches).id,
            rating=random.randint(1, 5),
            comment=fake.sentence()
        )
        db.session.add(rating)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_users()
        seed_pitches()
        seed_bookings()
        seed_ratings()

seed_data()

print("Seeding completed!")