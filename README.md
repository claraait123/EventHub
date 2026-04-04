# EventHub - Full-Stack Event Management System

**Live Application:** [---LINK---](---LINK---)

This repository contains the final project for the **Web Programming 2026** course (instructed by Dr. Alla Jammine). EventHub is a comprehensive full-stack web application designed for event and participant management. 

It features a primary backend built with Django REST Framework, a comparative backend built with Node.js/Express, and a dynamic Single Page Application (SPA) frontend built with React.

## Team Members
* **Clara AIT MOKHTAR** 
* **Vincent TAN** 
* **Maria AYDIN** 

## Key Features
* **Authentication & Authorization:** Secure token-based login with role-based access control (Admin/Editor vs Viewer).
* **Event Management:** Create, read, update, delete (CRUD), and filter events by status or date.
* **Participant Management:** Full CRUD operations for participant profiles.
* **Event Registration:** A dedicated Many-to-Many relationship allowing participants to register for multiple events without duplication.
* **Interactive Dashboard:** Summary views and user profiles with avatars.
* **Dark/Light Mode:** Integrated theme toggling for better UX.

## Tech Stack
* **Frontend:** React 19, Vite, React Router, Axios.
* **Primary Backend:** Python, Django, Django REST Framework (DRF).
* **Comparative Backend:** Node.js, Express.js.
* **Deployment:** Vercel (Frontend), Render/Other (Backend).

## Project Structure
The repository is divided into three main distinct parts:

* `/Django` - Main robust API implementing business logic, permissions, and relational database models.
* `/Node` - A comparative lightweight Express.js API handling core CRUD routes for analytical purposes.
* `/frontend` - The React Single Page Application (SPA) providing the user interface.

---

## Installation & Local Setup

To run this project locally, you will need **Python 3.x** and **Node.js** installed on your machine.

### 1. Django Backend Setup
Open a terminal and navigate to the `Django` folder:

```bash
cd Django

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and start the development server
python manage.py migrate
python manage.py runserver
```
*The Django API will be running at `http://127.0.0.1:8000/api/`*

### 2. Node.js Backend Setup (Comparative API)
Open a new terminal and navigate to the `Node` folder:

```bash
cd Node

# Install dependencies
npm install

# Start the Express server
npm start
```
*The Node API will be running at `http://localhost:3000/`*

### 3. React Frontend Setup
Open a new terminal and navigate to the `frontend` folder:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The React SPA will be available at `http://localhost:5173/`*

## Academic Deliverables
This repository fulfills the requirements for Labs 7–10:
* **Lab 7:** Django REST API with models, serializers, and validation.
* **Lab 8:** Node.js backend for structural and architectural comparison.
* **Lab 9:** React frontend with routing, state management, and API integration.
* **Lab 10:** Production deployment and technical documentation.

*(Note: The technical report and comparative presentation are submitted separately as per the assignment guidelines).*