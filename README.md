# EventHub - Full-Stack Application

This is the final project for the Web Programming 2026 course (Dr. Alla Jammine). 
EventHub is an Event and Participant Management System featuring a Django REST backend, a comparative Node.js backend, and a React SPA frontend.


## Team Members
* Clara AIT MOKHTAR
* Vincent TAN
* Maria AYDIN

## Project Structure
* `/Django` : Main Backend API (Django REST Framework)
* `/Node` : Comparative Backend (Express.js)
* `/frontend` : Single Page Application (React / Vite)


## Installation & Setup Guide

### 1. Django Backend
Open a terminal and navigate to the `Django` folder:

```bash
cd Django
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and start the server
python manage.py migrate
python manage.py runserver
```
*The Django API will be available at `http://127.0.0.1:8000/api/`*

### 2. React Frontend
Open a **new** terminal and navigate to the `frontend` folder:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The React SPA will be available at `http://localhost:5173/`*

### 3. Testing the Application
1. Access the frontend URL.
2. Click on **Sign Up** to create a new user account, or use the Django admin (`http://127.0.0.1:8000/admin/`) to create a superuser.
3. You can now create events, register participants, and test the filtering system.

