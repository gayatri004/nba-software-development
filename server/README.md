# NBA Software Development – Backend

## Project Overview
The backend of NBA Software Development handles API requests, authentication, data processing, database connectivity, and report generation for the NBA management system.

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv
- CORS
- bcrypt
- PDFKit
- Multer

## Features
- REST API Development
- User Authentication
- PostgreSQL Database Connectivity
- Employee and Institutional Data Management
- NBA Criteria Data Handling
- File Upload Management
- PDF and Report Generation

## Installation and Setup

### 1. Open the Server Folder
```bash
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create or update the `.env` file with the database and other configuration values required by the application.

**Important:** Do not upload `.env` files or database passwords to GitHub.

### 4. Start the Backend
```bash
node server.js
```

Use the port configured in the backend. In the current project, the server is intended to run on port `5000`.

## Database
The backend uses PostgreSQL to store and retrieve application data. Ensure PostgreSQL is running and the database configuration is correct before starting the server.

## API
The backend exposes API endpoints that the React frontend uses to communicate with the database and process application data.

## Project
NBA Software Development
