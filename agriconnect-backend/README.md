# AgriConnect Backend

Backend server for the AgriConnect application built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd @agriconnect-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables (see `.env.example`)

## Running the Server

- Development:
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```

The server will be running at `http://localhost:5000` by default.

## API Endpoints

- `GET /` - Welcome message

## Project Structure

```
@agriconnect-backend/
├── src/
│   ├── config/       # Database and other configurations
│   ├── controllers/  # Route controllers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── index.js      # Entry point
├── .env              # Environment variables
├── .gitignore
└── package.json
```
