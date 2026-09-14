# Simple To-Do List

A full-stack CRUD to-do list application with multi-user support. Built as a Holberton School Albania assignment covering Express.js, Sequelize, and MySQL on the backend, with a React frontend.

## Tech Stack

**Backend**
- Node.js / Express.js — REST API
- Sequelize — ORM
- MySQL — database
- cors — cross-origin requests between client and server

**Frontend**
- React (Vite)
- Bootstrap — styling

## Project Structure

```
simple-todo/
├── client/          # React frontend (Vite)
│   └── src/
│       └── App.jsx  # Main UI: user selector, task list, add/toggle/delete
└── server/          # Express backend
    ├── config/
    │   └── config.json.example  # Copy to config.json and fill in your own DB credentials
    ├── controllers/
    │   ├── taskController.js    # Task CRUD logic, filters by userId
    │   └── userController.js    # User CRUD logic
    ├── models/
    │   ├── task.js               # Task model, belongsTo User
    │   └── user.js               # User model, hasMany Task
    ├── migrations/                # DB schema migrations
    ├── routes/
    │   ├── taskRoutes.js
    │   └── userRoutes.js
    └── app.js                     # Server entry point
```

## Data Model

Two tables connected by a foreign key: each **Task** belongs to one **User**; each **User** can have many **Tasks**.

**User**

| Field | Type    | Notes                    |
|-------|---------|---------------------------|
| id    | INTEGER | primary key, auto-increment |
| name  | STRING  |                            |
| email | STRING  |                            |

**Task**

| Field       | Type    | Notes                        |
|-------------|---------|-------------------------------|
| id          | INTEGER | primary key, auto-increment  |
| title       | STRING  | required                     |
| description | STRING  | optional                     |
| completed   | BOOLEAN | defaults to `false`          |
| userId      | INTEGER | foreign key → Users.id, required |

## Setup

### Prerequisites
- Node.js (v20.15.1 or compatible)
- MySQL server running locally

### 1. Clone and install

```bash
git clone <repo-url>
cd simple-todo
```

### 2. Backend setup

```bash
cd server
npm install
```

Copy the example config and fill in your own MySQL credentials:

```bash
cp config/config.json.example config/config.json
```

Edit `config/config.json` — set `username`, `password`, `database`, `host`, and `dialect: "mysql"` under the `development` block.

Create the database in MySQL (name must match `config.json`):

```sql
CREATE DATABASE simple_todo;
```

Run the migrations to create the `Users` and `Tasks` tables:

```bash
npx sequelize-cli db:migrate
```

Start the server:

```bash
npm start
```

Server runs on `http://localhost:3000`.

### 3. Frontend setup

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). Pick a user from the dropdown (or create one with the `+` button) before adding tasks — each task must belong to a user.

**Note:** both the backend (`server/`, port 3000) and frontend (`client/`, port 5173) must be running at the same time, in separate terminals, for the app to work.

## API Endpoints

Base URL: `http://localhost:3000/api`

### Tasks — `/api/tasks`

| Method | Endpoint | Description                          | Success Response |
|--------|----------|----------------------------------------|-------------------|
| POST   | `/`      | Create a task (`title`, `userId` required) | `201` + created task |
| GET    | `/?userId=<id>` | Get all tasks for a given user, with nested `User` info | `200` + array of tasks |
| GET    | `/:id`   | Get a single task by ID, with nested `User` info | `200` + task, or `404` |
| PUT    | `/:id`   | Update a task                        | `200` + updated task, or `404` |
| DELETE | `/:id`   | Delete a task                        | `204` no content, or `404` |

### Users — `/api/users`

| Method | Endpoint | Description                        | Success Response |
|--------|----------|--------------------------------------|-------------------|
| POST   | `/`      | Create a user (`name`, `email`)    | `201` + created user |
| GET    | `/`      | Get all users, with nested `Tasks` | `200` + array of users |
| GET    | `/:id`   | Get a single user by ID, with nested `Tasks` | `200` + user, or `404` |
| PUT    | `/:id`   | Update a user                      | `200` + updated user, or `404` |
| DELETE | `/:id`   | Delete a user                      | `204` no content, or `404` |

### Example requests

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Juri","email":"juri@test.com"}'

# Create a task for that user
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","userId":1}'

# Get all tasks belonging to user 1
curl "http://localhost:3000/api/tasks?userId=1"

# Mark a task complete
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a task
curl -X DELETE http://localhost:3000/api/tasks/1
```

## Author

Juri — Holberton School Albania