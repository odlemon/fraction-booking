# Booking API

A lightweight REST API that supports booking management and timesheet approval flow. This API allows you to create bookings, view all bookings, and update timesheet statuses.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Testing Scenarios](#testing-scenarios)
- [Project Structure](#project-structure)

## Features

- Create new bookings with job role, location, date, and time information
- Retrieve a list of all bookings
- Update timesheet status (approve/reject)
- Input validation and error handling
- In-memory data storage

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/odlemon/fraction-booking.git

2. Install dependencies:

```npm install

```

## Running the Server

### Development Mode

Run the server in development mode with hot reloading:

```shellscript
npm run dev
```

### Production Mode

Build and run the server in production mode:

```shellscript
npm run build
npm start
```

The server will start on port 3000 by default.

## API Endpoints

### Get All Bookings

Retrieves a list of all bookings.

- **URL**: `/bookings`
- **Method**: `GET`
- **Success Response**:

- **Code**: 200
- **Content**:


The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Get All Bookings

Retrieves a list of all bookings.

- **URL**: `/bookings`
- **Method**: `GET`
- **Success Response**:

- **Code**: 200
- **Content**:

```json
[
  {
    "id": "1",
    "jobRole": "Nurse",
    "location": "London",
    "date": "2025-04-07",
    "startTime": "09:00",
    "endTime": "17:00",
    "timesheetStatus": "Pending"
  }
]
```




### Create a Booking

Creates a new booking.

- **URL**: `/bookings`
- **Method**: `POST`
- **Request Body**:

```json
{
  "jobRole": "Nurse",
  "location": "London",
  "date": "2025-04-07",
  "startTime": "09:00",
  "endTime": "17:00"
}
```


- **Success Response**:

- **Code**: 201
- **Content**:

```json
{
  "id": "1",
  "jobRole": "Nurse",
  "location": "London",
  "date": "2025-04-07",
  "startTime": "09:00",
  "endTime": "17:00",
  "timesheetStatus": "Pending"
}
```





- **Error Responses**:

- **Code**: 400
- **Content**:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "All fields are required: jobRole, location, date, startTime, endTime"
}
```


- **Code**: 400
- **Content**:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Date must be in YYYY-MM-DD format"
}
```


- **Code**: 400
- **Content**:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Time must be in HH:MM format (24-hour)"
}
```


- **Code**: 400
- **Content**:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "End time must be after start time"
}
```







### Update Timesheet Status

Updates the timesheet status of a booking.

- **URL**: `/bookings/:id/timesheet`
- **Method**: `POST`
- **URL Parameters**: `id=[string]` where `id` is the ID of the booking
- **Request Body**:

```json
{
  "action": "approve" // or "reject"
}
```


- **Success Response**:

- **Code**: 200
- **Content**:

```json
{
  "id": "1",
  "jobRole": "Nurse",
  "location": "London",
  "date": "2025-04-07",
  "startTime": "09:00",
  "endTime": "17:00",
  "timesheetStatus": "Approved"
}
```





- **Error Responses**:

- **Code**: 400
- **Content**:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Action must be either \"approve\" or \"reject\""
}
```


- **Code**: 404
- **Content**:

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Booking with ID 999 not found"
}
```







## Testing Scenarios

### Scenario 1: Create and Retrieve Bookings

1. Create a new booking:

```plaintext
POST /bookings
{
  "jobRole": "Nurse",
  "location": "London",
  "date": "2025-04-07",
  "startTime": "09:00",
  "endTime": "17:00"
}
```


2. Retrieve all bookings:

```plaintext
GET /bookings
```




### Scenario 2: Update Timesheet Status

1. Create a booking (as in Scenario 1)
2. Approve the timesheet:

```plaintext
POST /bookings/1/timesheet
{
  "action": "approve"
}
```


3. Retrieve all bookings to verify the status change:

```plaintext
GET /bookings
```




### Scenario 3: Validation Errors

1. Create a booking with missing fields:

```plaintext
POST /bookings
{
  "jobRole": "Nurse",
  "location": "London"
}
```

Expected: 400 Bad Request


2. Create a booking with invalid date format:

```plaintext
POST /bookings
{
  "jobRole": "Nurse",
  "location": "London",
  "date": "07-04-2025",
  "startTime": "09:00",
  "endTime": "17:00"
}
```

Expected: 400 Bad Request


3. Create a booking with end time before start time:

```plaintext
POST /bookings
{
  "jobRole": "Nurse",
  "location": "London",
  "date": "2025-04-07",
  "startTime": "17:00",
  "endTime": "09:00"
}
```

Expected: 400 Bad Request


4. Update timesheet for non-existent booking:

```plaintext
POST /bookings/999/timesheet
{
  "action": "approve"
}
```

Expected: 404 Not Found




## Project Structure

```plaintext
booking-api/
├── src/                        # Source code
│   ├── controllers/            # Request handlers
│   │   └── booking.controller.ts
│   ├── middleware/             # Express middleware
│   │   └── error.middleware.ts
│   ├── models/                 # Data models
│   │   └── booking.model.ts
│   ├── repositories/           # Data access layer
│   │   └── booking.repository.ts
│   ├── routes/                 # API routes
│   │   └── booking.routes.ts
│   ├── services/               # Business logic
│   │   └── booking.service.ts
│   ├── types/                  # TypeScript types
│   │   ├── booking.types.ts
│   │   ├── dtos.ts
│   │   └── error.types.ts
│   └── app.ts                  # Main application file
├── .gitignore                  # Git ignore file
├── package.json                # Project metadata and dependencies
├── README.md                   # Project documentation
└── tsconfig.json               # TypeScript configuration
```