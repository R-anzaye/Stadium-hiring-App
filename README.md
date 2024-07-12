# PresentSpotter

PresentSpotter is a web application for booking football pitches. The application allows users to register, login, book pitches, and leave reviews. Administrators can manage pitches and view user bookings.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Backend Endpoints](#backend-endpoints)
- [Frontend Components](#frontend-components)
- [Usage](#usage)
  - [Register a New User](#register-a-new-user)
  - [Login](#login)
  - [Book a Pitch](#book-a-pitch)
  - [Leave a Review](#leave-a-review)
  - [Admin Functionalities](#admin-functionalities)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (login, logout, registration)
- Admin and User roles
- Pitch management (admin)
- Pitch booking (user)
- Reviews and ratings (user)
- Responsive design

## Tech Stack

- **Frontend**: React, React Router, React Toastify, CSS
- **Backend**: Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Flask-Bcrypt, Flask-CORS
- **Database**: SQLite (development)

## Installation

### Prerequisites

- Node.js
- Python *
- pip
- virtualenv

### Backend Setup
# Clone the repository:

- git clone https://github.com/WendyKariuki/Stadium-hiring-App.git
- cd Stadium-hiring-App/backend
- 
## Set up virtual environment and install dependencies:

- source venv/bin/activate  # On Windows use `venv\Scripts\activate`
- pip install -r requirements.txt
## Set environment variables:

- export FLASK_APP=run.py
- export FLASK_ENV=development  # Use `production` for production
- export SECRET_KEY='your_secret_key'
- export DATABASE_URL='sqlite:///your_database.db'

## Run the server:
- flask run

## Navigate to the frontend directory:
- cd ../frontend
  
## Install dependencies:

- npm install
- npm run dev

# Usage
- Register a New User
- To register a new user, navigate to the registration page and fill out the form with required details.

# Login
- Once registered, use the login page to access your account using your credentials.

# Book a Pitch
-Navigate to the pitch booking page, select your desired pitch and date, and confirm your booking.

# Leave a Review
- After booking, you can leave a review and rating for the pitch you booked.

# Admin Functionalities
- Admins can manage pitches, view user bookings, and perform administrative tasks from the admin dashboard.

# Contributing
- Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

# License
MIT

# Creators:
- Ryan Anzaye
- Reuben Kamau
- Wendy Kariuki
- Visit the live website: https://6691a11333078d546524debc--eclectic-manatee-1b08d4.netlify.app/
