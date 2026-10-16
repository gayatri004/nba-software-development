# NBA Software Development

## Project Overview

NBA Software Development is a web-based application designed to manage accreditation-related information, criteria, master forms, and institutional data through a centralized system.

## Project Domain
- Full Stack Web Development

## Technologies Used
- Frontend: React.js, HTML, CSS, Bootstrap, JavaScript
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Version Control: Git and GitHub

## Main Features
- Admin Dashboard
- Authentication and Login
- Employee Management
- Department Management
- Faculty Management
- Attendance and Leave Management
- Salary Management
- Course Management
- NBA Criteria Management
- Master Forms
- Reports and PDF Generation

## Project Structure

```text
NBA Software Development/
├── client/
│   └── README.md
├── server/
│   └── README.md
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gayatri004/nba-software-development.git
cd nba-software-development
```

### 2. Setup Frontend

```bash
cd client
npm install
npm start
```

The React application runs at `http://localhost:3000` by default.

### 3. Setup Backend

Open another terminal:

```bash
cd server
npm install
node server.js
```

Configure the required environment variables and PostgreSQL database before starting the backend.

## Database Configuration

Use PostgreSQL and configure the database connection using the environment variables required by the backend.

Do not commit passwords, database credentials, API keys, or `.env` files to GitHub.

## Deployment

The application can be deployed using suitable frontend and backend hosting services.

## Developer

NBA Software Development Project

## License

This project is intended for academic and educational purposes.