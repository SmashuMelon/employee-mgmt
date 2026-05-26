# Employee Management

A web application built with React and Django Rest Framework.

## Project Overview

This repository contains two main folders:

- `backend_django/` - Django REST API backend for departments, employees, and tasks.
- `frontend_react/` - React frontend built with Vite, Tailwind CSS, React Query, and React Hook Form.

The frontend supports a manager control panel and an employee task view. Authentication uses Django REST Framework token authentication.

## Prerequisites

- Python 3.11 or newer
- Node.js 18 or newer
- npm

## Backend Setup

### Linux

```bash
cd backend_django
python -m venv env
source env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_initial_users
python manage.py runserver
```

### Windows

```powershell
cd backend_django
python -m venv env
.\env\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_initial_users
python manage.py runserver
```

## Frontend Setup

### Linux

```bash
cd frontend_react
npm install
npm run dev -- --host
```

### Windows

```powershell
cd frontend_react
npm install
npm run dev -- --host
```

## Default Login Credentials

After running `seed_initial_users`, use the following credentials:

- Admin: `admin` / `admin`
- Employee: `employee` / `employee`

## Notes

- The backend runs on `http://127.0.0.1:8000/` by default.
- The frontend runs on `http://127.0.0.1:5173/` by default.
- If the backend uses a different URL, add `VITE_API_URL` to a `.env` file inside `frontend_react/`.
- The `seed_initial_users` command is safe to run multiple times and will not duplicate existing users.
