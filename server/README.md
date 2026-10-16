# NBA Software Development – Backend

## Project Overview

The backend of NBA Software Development manages API requests, authentication, database connectivity, data processing, file uploads, and document generation for the NBA accreditation management system.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)
- bcrypt
- dotenv
- CORS
- Multer
- PDFKit
- PDF Merger
- Image to PDF
- LibreOffice Convert
- fs-extra

## Features

- REST API Development
- User Authentication and Password Hashing
- PostgreSQL Database Connectivity
- NBA Criteria Data Handling
- Institutional Data Management
- File Upload Management
- PDF and Document Processing
- Report Generation Support

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

Create a `.env` file in the server folder and configure the database connection and other environment variables required by `server.js`.

**Important:** Do not upload `.env` files, database passwords, or other secret credentials to GitHub.

### 4. Start the Backend

For normal execution:

```bash
npm start
```

For development with automatic server restarts:

```bash
npm run dev
```

The development command uses Nodemon.

The backend is intended to run on port `5000`, according to the project configuration. Confirm the actual port in `server.js`.

## Database

The backend uses PostgreSQL to store and retrieve application data. Ensure that PostgreSQL is running and that the database connection settings are correctly configured.

## API Communication

The backend exposes API endpoints that the React frontend uses to exchange data and perform application operations.

## Project Purpose

To provide backend services for centralized NBA accreditation, criteria data, institutional information, and document management.

## Project

NBA Software Development
